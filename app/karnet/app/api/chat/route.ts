import { auth, clerkClient } from '@clerk/nextjs/server';
import { convertToModelMessages, generateId, generateText, streamText } from 'ai';
import { fetchMutation } from 'convex/nextjs';
import { after } from 'next/server';
import { createResumableStreamContext } from 'resumable-stream';
import { openRouterGateway } from '@/ai/gateway';
import { supportedModels } from '@/ai/models';
import type { ChatUIMessage } from '@/components/chat/chat.types';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
// @ts-expect-error
import basePrompt from './base_prompt.md';

interface BodyData {
    messages: ChatUIMessage[];
    chatId: string;
    modelId: string;
    streamId: string;
}

export async function POST(req: Request) {
    // extract clerk jwt token
    const { sessionId } = await auth();
    if (!sessionId) {
        return new Response('Unauthorized', { status: 401 });
    }
    const tokenRes = await (await clerkClient()).sessions.getToken(sessionId, 'convex');
    if (!tokenRes) {
        return new Response('Unauthorized', { status: 401 });
    }

    const [{ messages, modelId, chatId, streamId }] = await Promise.all([req.json() as Promise<BodyData>]);

    const model = supportedModels.find((m) => m.id === modelId);

    if (!model) {
        return new Response('Model not found', { status: 404 });
    }

    const userInputMessage = messages.filter((m) => m.role === 'user')[0].parts.find((p) => p.type === 'text')?.text;

    if (!userInputMessage) {
        throw new Error('User input message not found');
    }

    console.log('[Chat] starting chat', model);

    const openRouter = openRouterGateway();

    const res = streamText({
        // model: gateway(model.id),
        model: openRouter(model.id),
        system: basePrompt,
        messages: convertToModelMessages(messages),
    });

    return res.toUIMessageStreamResponse({
        originalMessages: messages,
        generateMessageId: generateId,
        messageMetadata: () => ({
            model: model.name,
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
                    id: chatId as Id<'chats'>,
                    messages: preparedMessages,
                },
                {
                    token: tokenRes.jwt,
                }
            );
            console.log('[Chat] finished chat', chatId);

            // generate a title for the chat
            const titlePrompt = `Generate a title for the chat based on the following messages (put an emoji at the beginning, keep the title short): ${JSON.stringify(preparedMessages)}`;
            const title = await generateText({
                model: openRouter('google/gemini-2.5-flash-lite'),
                prompt: titlePrompt,
            });

            console.log('[Chat] generated title', title.text);

            await fetchMutation(
                api.functions.chat.updateChatTitle,
                {
                    id: chatId as Id<'chats'>,
                    title: title.text,
                },
                {
                    token: tokenRes.jwt,
                }
            );
        },
        async consumeSseStream({ stream }) {
            const streamContext = createResumableStreamContext({
                waitUntil: after,
            });
            await streamContext.createNewResumableStream(streamId, () => stream);

            console.log('[Chat] created new resumable stream', streamId);

            // change the stream status to active
            await fetchMutation(
                api.functions.chat.updateChatStream,
                {
                    id: chatId as Id<'chats'>,
                    stream: {
                        status: 'active',
                        id: streamId,
                    },
                },
                {
                    token: tokenRes.jwt,
                }
            );

            console.log('[Chat] updated stream status to active', chatId);
        },
    });
}
