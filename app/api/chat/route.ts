import { withTracing } from "@posthog/ai";
import * as Sentry from "@sentry/nextjs";
import { geolocation } from "@vercel/functions";
import { convertToModelMessages, generateId, generateText, smoothStream, streamText } from "ai";
import { fetchMutation } from "convex/nextjs";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { openRouterGateway } from "@/ai/gateway";
import { supportedModels } from "@/ai/models";
import type { ChatUIMessage } from "@/components/ai/chat/chat.types";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { KarnetModel } from "@/hooks/useModels";
import { phClient } from "@/lib/posthog";
import { generatePrompt } from "@/lib/prompt";
import { getSession } from "@/lib/session";

type BodyData = {
    messages: ChatUIMessage[];
    chatId: string;
    model: KarnetModel;
    streamId: string;
    webSearch?: boolean;
};

export async function POST(req: Request) {
    return await Sentry.startSpan(
        {
            name: "POST /api/chat",
            op: "http.server",
        },
        async (span) => {
            // start by getting the token async
            getSession();

            const [{ messages, model, chatId, streamId, webSearch }] = await Promise.all([
                req.json() as Promise<BodyData>,
            ]);

            span.setAttributes({
                modelId: model.id,
                chatId,
                streamId,
                messages: JSON.stringify(messages),
                webSearch,
            });

            if (!model) {
                return new Response("Model not found", { status: 404 });
            }

            const userInputMessage = messages
                .filter((m) => m.role === "user")[0]
                .parts.find((p) => p.type === "text")?.text;

            if (!userInputMessage) {
                throw new Error("User input message not found");
            }

            const openRouter = openRouterGateway();

            const _model = withTracing(openRouter(webSearch ? `${model.id}:online` : model.id), phClient, {});

            const geo = geolocation(req);
            const geoString = geo.city ? `${geo.city}, ${geo.country}` : "Paris France";

            const prompt = generatePrompt(model.name, new Date().toLocaleString(), geoString);

            const res = streamText({
                model: _model,
                system: prompt,
                messages: convertToModelMessages(messages),
                experimental_transform: smoothStream({ chunking: "word" }),
            });

            Sentry.startSpan(
                {
                    name: "updateChatMessages",
                    attributes: {
                        chatId,
                        messages: JSON.stringify(messages),
                    },
                },
                async () => {
                    fetchMutation(
                        api.functions.chat.updateChat,
                        {
                            id: chatId as Id<"chats">,
                            messages: messages.map((m) => ({
                                id: m.id,
                                role: m.role,
                                parts: JSON.stringify(m.parts),
                                metadata: JSON.stringify(m.metadata),
                            })),
                        },
                        {
                            token: await getSession(),
                        }
                    );
                }
            );

            const streamContext = createResumableStreamContext({
                waitUntil: after,
            });

            return res.toUIMessageStreamResponse({
                originalMessages: messages,
                generateMessageId: generateId,
                sendSources: true,
                sendReasoning: true,
                sendStart: true,
                messageMetadata: (metadata) => ({
                    model: model.name,
                    ...metadata,
                }),
                onFinish: (message) => {
                    return Sentry.startSpan(
                        {
                            name: "finishChatStream",
                            attributes: {
                                chatId,
                                messages: JSON.stringify(message.messages),
                            },
                        },
                        async () => {
                            const preparedMessages = message.messages.map((m) => ({
                                role: m.role,
                                id: m.id,
                                // we cannot store the metadata because the type is unknown
                                metadata: JSON.stringify(m.metadata) || undefined,
                                // we cannot store the parts because the type too complexe and will change
                                parts: JSON.stringify(m.parts),
                            }));

                            await Sentry.startSpan(
                                {
                                    name: "finishChatStream",
                                },
                                async () => {
                                    await fetchMutation(
                                        api.functions.chat.finishChatStream,
                                        {
                                            id: chatId as Id<"chats">,
                                            messages: preparedMessages,
                                        },
                                        {
                                            token: await getSession(),
                                        }
                                    );
                                }
                            );

                            await Sentry.startSpan(
                                {
                                    name: "generateTitle",
                                    attributes: {
                                        chatId,
                                        messages: JSON.stringify(preparedMessages),
                                    },
                                },
                                async (titleSpan) => {
                                    // generate a title for the chat
                                    const titlePrompt = `Generate a title for the chat based on the following messages (put an emoji at the beginning, keep the title short): ${JSON.stringify(preparedMessages)}`;
                                    const _modelTitle = withTracing(
                                        openRouter("google/gemini-2.5-flash-lite"),
                                        phClient,
                                        {
                                            posthogProperties: {
                                                is_generating_title: true,
                                            },
                                        }
                                    );
                                    const title = await generateText({
                                        model: _modelTitle,
                                        prompt: titlePrompt,
                                    });

                                    titleSpan.setAttributes({
                                        title: title.text,
                                    });

                                    await fetchMutation(
                                        api.functions.chat.updateChatTitle,
                                        {
                                            id: chatId as Id<"chats">,
                                            title: title.text,
                                        },
                                        {
                                            token: await getSession(),
                                        }
                                    );
                                }
                            );
                        }
                    );
                },
                onError: (error) => {
                    Sentry.captureException(error);
                    console.error("[Chat] error", error);
                    return "Error while streaming in the chat";
                },
                async consumeSseStream({ stream }) {
                    await streamContext.createNewResumableStream(streamId, () => stream);

                    await Sentry.startSpan(
                        {
                            name: "updateChatStream",
                            attributes: {
                                chatId,
                                streamId,
                            },
                        },
                        async () => {
                            // change the stream status to active
                            await fetchMutation(
                                api.functions.chat.updateChatStream,
                                {
                                    id: chatId as Id<"chats">,
                                    stream: {
                                        status: "active",
                                        id: streamId,
                                    },
                                },
                                {
                                    token: await getSession(),
                                }
                            );
                        }
                    );
                },
            });
        }
    );
}
