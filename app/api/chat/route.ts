import * as Sentry from "@sentry/nextjs";
import { geolocation } from "@vercel/functions";
import { convertToModelMessages, generateId, generateText, smoothStream, streamText } from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { openRouterGateway } from "@/ai/gateway";
import { bodySchema } from "@/ai/schema/chat";
import type { ChatUIMessage } from "@/components/ai/chat/chat.types";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { generatePrompt } from "@/lib/prompt";
import { getSession } from "@/lib/session";

function dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(",")[1]);

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const bb = new Blob([ab]);
    return bb;
}

async function handleMessageImageUpload(inputMessages: ChatUIMessage[], token: string) {
    const messages = inputMessages;
    for (const message of messages) {
        for (const part of message.parts) {
            if (part.type === "file" && part?.url?.includes("data:image")) {
                const blob = dataURItoBlob(part.url);
                const uploadUrl = await fetchMutation(api.functions.files.generateImageUploadUrl, {}, { token });
                const uploadResponse = await fetch(uploadUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": part.mediaType,
                    },
                    body: blob,
                });

                const { storageId } = await uploadResponse.json();

                const { url } = await fetchQuery(api.functions.files.getImageUrl, { id: storageId }, { token });

                part.url = url as string;
                // @ts-expect-error
                part._karnet_key = storageId;
            }
        }
    }

    return messages;
}

export async function POST(req: Request) {
    return await Sentry.startSpan(
        {
            name: "POST /api/chat",
            op: "http.server",
        },
        async (span) => {
            try {
                // start by getting the token async
                const { jwt } = await getSession();
                if (!jwt) {
                    span.setStatus({ code: 1, message: "Unauthorized" });
                    return new Response("Unauthorized", { status: 401 });
                }

                const body = await req.json();
                const { messages, model, chatId, streamId, tools } = bodySchema.parse(body);

                span.setAttributes({
                    modelId: model.id,
                    chatId,
                    streamId,
                    messages: JSON.stringify(messages),
                    tools,
                });

                // create the new chat if it doesn't exist
                await fetchMutation(
                    api.functions.chat.generateNewChat,
                    {
                        id: chatId,
                    },
                    {
                        token: jwt,
                    }
                );

                const openRouter = openRouterGateway();
                const plugins: unknown[] = [];

                if (tools?.includes("ocr")) {
                    plugins.push({
                        id: "file-parser",
                        engine: {
                            pdf: "mistra",
                        },
                    });
                }

                if (tools?.includes("web")) {
                    plugins.push({
                        id: "web",
                        engine: "exa",
                        max_results: 5,
                    });
                }

                const _model = openRouter(model.id, {
                    extraBody: {
                        plugins,
                    },
                });

                const geo = geolocation(req);
                const geoString = geo.city ? `${geo.city}, ${geo.country}` : "Paris France";
                const prompt = generatePrompt(model.name, new Date().toLocaleString(), geoString);

                const streamStartTime = new Date();

                const modelMessages = convertToModelMessages(messages);

                const res = streamText({
                    model: _model,
                    system: prompt,
                    messages: modelMessages,
                    experimental_transform: smoothStream({ chunking: "word" }),
                    providerOptions: {},
                });

                const generateTitle = async () =>
                    await Sentry.startSpan(
                        {
                            name: "generateTitle",
                            attributes: {
                                chatId,
                            },
                        },
                        async (titleSpan) => {
                            let text = "";
                            for (const message of messages) {
                                if (message.role === "user") {
                                    text += message.parts
                                        .filter((p) => p.type === "text")
                                        .map((p) => p.text)
                                        .join(" ");
                                }
                            }

                            // generate a title for the chat
                            const titlePrompt = `You are a title generator that generates titles for LLM chats. 
                            The text is: "${text}". Most of the time, the first message is the most important one. 
                            Generate one (only ONE) title for the chat based on the text (put an emoji at the beginning, keep the title short):`;

                            const _modelTitle = openRouter("google/gemini-2.5-flash-lite");
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
                                    id: chatId,
                                    title: title.text,
                                },
                                {
                                    token: jwt,
                                }
                            );
                        }
                    );

                generateTitle();

                const streamContext = createResumableStreamContext({
                    waitUntil: after,
                });

                return res.toUIMessageStreamResponse({
                    originalMessages: messages,
                    generateMessageId: generateId,
                    sendSources: true,
                    sendReasoning: true,
                    sendStart: true,
                    messageMetadata: ({ part }) => {
                        if (part.type === "finish") {
                            return {
                                model: {
                                    name: model.name,
                                    id: model.id,
                                    provider: model.provider,
                                },
                                usage: part.totalUsage,
                                time: Date.now() - streamStartTime.getTime(),
                            };
                        }
                    },
                    onFinish: ({ messages: _messages }) => {
                        return Sentry.startSpan(
                            {
                                name: "finishChatStream",
                                attributes: {
                                    chatId,
                                    messages: JSON.stringify(messages),
                                },
                            },
                            async () => {
                                const updatedMessages = await handleMessageImageUpload(_messages, jwt);

                                const preparedMessages = updatedMessages.map((m) => ({
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
                                                token: jwt,
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
                                        token: jwt,
                                    }
                                );
                            }
                        );
                    },
                });
            } catch (error) {
                Sentry.captureException(error);
                console.error("[Chat] general error", error);
                return new Response("Error while streaming in the chat", { status: 500 });
            }
        }
    );
}
