import { geolocation } from "@vercel/functions";
import { convertToModelMessages, generateId, generateText, smoothStream, streamText } from "ai";
import { fetchMutation } from "convex/nextjs";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { openRouterGateway } from "@/ai/gateway";
import { supportedModels } from "@/ai/models";
import type { ChatUIMessage } from "@/components/chat/chat.types";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { generatePrompt } from "@/lib/prompt";
import { getSession } from "@/lib/session";

type BodyData = {
    messages: ChatUIMessage[];
    chatId: string;
    modelId: string;
    streamId: string;
    webSearch?: boolean;
};

export async function POST(req: Request) {
    const now = performance.now();
    // start by getting the token async
    getSession();

    const [{ messages, modelId, chatId, streamId, webSearch }] = await Promise.all([req.json() as Promise<BodyData>]);
    const model = supportedModels.find((m) => m.id === modelId);

    console.log("[Chat] new chat", {
        modelId,
        chatId,
        streamId,
        webSearch,
    });

    if (!model) {
        return new Response("Model not found", { status: 404 });
    }

    const userInputMessage = messages.filter((m) => m.role === "user")[0].parts.find((p) => p.type === "text")?.text;

    if (!userInputMessage) {
        throw new Error("User input message not found");
    }

    const openRouter = openRouterGateway();

    const geo = geolocation(req);
    const geoString = geo.city ? `${geo.city}, ${geo.country}` : "Paris France";

    const prompt = generatePrompt(model.name, new Date().toLocaleString(), geoString);

    console.log("[Chat] websearch", {
        model: model.id,
        webSearch,
    });

    const res = streamText({
        model: openRouter(webSearch ? `${model.id}:online` : model.id),
        system: prompt,
        messages: convertToModelMessages(messages),
        // biome-ignore lint/style/useNamingConvention: i dont control the API
        experimental_transform: smoothStream({ chunking: "word" }),
    });

    fetchMutation(
        api.functions.chat.updateChatMessages,
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
        onFinish: async (message) => {
            const preparedMessages = message.messages.map((m) => ({
                role: m.role,
                id: m.id,
                // we cannot store the metadata because the type is unknown
                metadata: JSON.stringify(m.metadata) || undefined,
                // we cannot store the parts because the type too complexe and will change
                parts: JSON.stringify(m.parts),
            }));
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
            console.log("[Chat] finished chat", chatId);

            // generate a title for the chat
            const titlePrompt = `Generate a title for the chat based on the following messages (put an emoji at the beginning, keep the title short): ${JSON.stringify(preparedMessages)}`;
            const title = await generateText({
                model: openRouter("google/gemini-2.5-flash-lite"),
                prompt: titlePrompt,
            });

            console.log("[Chat] generated title", title.text);

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
        },
        onError: (error) => {
            console.error("[Chat] error", error);
            return "Error while streaming in the chat";
        },
        async consumeSseStream({ stream }) {
            console.log("[Chat] start streaming", performance.now() - now, "ms");
            console.log("[Chat] created new resumable stream", streamId);

            await streamContext.createNewResumableStream(streamId, () => stream);

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

            console.log("[Chat] updated stream status to active", {
                chatId,
                streamId,
            });
        },
    });
}
