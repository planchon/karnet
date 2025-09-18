'use client';

import { useChat } from '@ai-sdk/react';
import { cn } from '@editor/utils/tiptap-utils';
import { IconSend } from '@tabler/icons-react';
import type { Editor } from '@tiptap/core';
import { Button } from '@ui/button';
import { Shortcut } from '@ui/shortcut';
import { generateId } from 'ai';
import { useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import { Chat } from '@/components/chat';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useShortcut } from '@/hooks/useShortcut';
import { useStores } from '@/hooks/useStores';

export default observer(function ChatPage() {
    const { id } = useParams();
    const { chatStore } = useStores();
    const editorRef = useRef<Editor | null>(null);
    const chat = useQuery(api.functions.chat.getChat, {
        id: id as Id<'chats'>,
    });

    const { messages, sendMessage, setMessages } = useChat({
        id: id as string,
        resume: true,
    });

    useEffect(() => {
        if (chat) {
            const parsedMessage = chat.messages.map((m) => ({
                role: m.role,
                id: m.id,
                parts: JSON.parse(m.parts),
                metadata: m.metadata ? JSON.parse(m.metadata) : undefined,
            }));
            setMessages(parsedMessage);
        }
    }, [chat, setMessages]);

    const onSend = () => {
        const text = editorRef.current?.getText();
        if (!text) {
            alert('Please enter a message');
            return;
        }

        const streamId = generateId();

        sendMessage(
            { text },
            {
                body: {
                    modelId: chatStore.selectedModel.id,
                    chatId: chat?._id,
                    streamId,
                },
            }
        );

        // for the history feature
        localStorage.setItem('chat-history', text);

        // clear the editor
        editorRef.current?.commands.setContent('');
    };

    useShortcut('Control+Enter', onSend);
    useShortcut('Command+Enter', onSend);

    if (!chat) {
        return <Loader />;
    }

    return (
        <div className="flex h-full w-full flex-col">
            <Conversation className="relative h-full w-full">
                <ConversationContent className="mx-auto w-8/12 pb-64">
                    {messages.map((message) => (
                        <Message from={message.role} key={message.id}>
                            <MessageContent variant="flat">
                                {message.parts.map((part, i) => {
                                    switch (part.type) {
                                        case 'text': // we don't use any reasoning or tool calls in this example
                                            return <Response key={`${message.id}-${i}`}>{part.text}</Response>;
                                        default:
                                            return null;
                                    }
                                })}
                            </MessageContent>
                        </Message>
                    ))}
                </ConversationContent>
                <ConversationScrollButton className="bottom-[180px]" />
            </Conversation>
            <div
                className={cn('pointer-events-none absolute bottom-0 z-0 flex h-full w-full flex-col items-center')}
                style={{
                    justifyContent: 'flex-end',
                    paddingBottom: '12px',
                }}
            >
                <motion.div
                    className="pointer-events-auto z-50 w-9/12 max-w-[900px] overflow-hidden rounded-xl border bg-gray-100"
                    layout
                    transition={{
                        duration: 0.2,
                        ease: 'easeInOut',
                    }}
                >
                    <Chat.Root>
                        <div className="h-full w-full rounded-b-xl bg-white p-2 shadow-md">
                            <Chat.Input className="h-20" ref={editorRef} />
                        </div>
                        <div className="flex w-full justify-between p-2 py-0 pt-3 pl-1">
                            <div className="flex items-center gap-0">
                                <Chat.ModelSelect />
                                <Chat.MCPSelect />
                            </div>
                            <div className="pb-2">
                                <Button className="h-8 rounded-sm pr-[6px]! pl-[8px]!" onClick={onSend}>
                                    <IconSend className="size-4" />
                                    Send
                                    <Shortcut nothen shortcut={['⌘', '↵']} />
                                </Button>
                            </div>
                        </div>
                    </Chat.Root>
                </motion.div>
            </div>
        </div>
    );
});
