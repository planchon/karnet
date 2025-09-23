"use client";

import { useChat } from "@ai-sdk/react";
import { convexQuery } from "@convex-dev/react-query";
import { cn } from "@editor/utils/tiptap-utils";
import { IconSend } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { Editor } from "@tiptap/core";
import { Button } from "@ui/button";
import { Shortcut } from "@ui/shortcut";
import { generateId } from "ai";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { observer } from "mobx-react";
import { memo, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Chat } from "@/components/chat";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useShortcut } from "@/hooks/useShortcut";
import { useStores } from "@/hooks/useStores";

export const ChatWithIdPage = observer(function ChatPage() {
    const { chatId } = useParams();
    const { chatStore } = useStores();
    const editorRef = useRef<Editor | null>(null);
    const chat = useQuery({
        ...convexQuery(api.functions.chat.getChat, {
            id: chatId as Id<"chats">,
        }),
        initialData: JSON.parse(localStorage.getItem(`chat:${chatId}`) || "null"),
    });

    const { messages, sendMessage, setMessages, status } = useChat({
        id: chat.data?._id,
        resume: chat.data?.stream.status === "active",
        experimental_throttle: 200,
    });

    useEffect(() => {
        if (chat.data) {
            const parsedMessage = chat.data.messages.map((m) => ({
                role: m.role,
                id: m.id,
                parts: JSON.parse(m.parts),
                metadata: m.metadata ? JSON.parse(m.metadata) : undefined,
            }));
            setMessages(parsedMessage);
        }
    }, [chat.data, setMessages]);

    useEffect(() => {
        debounce(() => {
            console.log("setting local storage");
            localStorage.setItem(`chat:${chatId}`, JSON.stringify(chat.data));
        }, 5000);
    }, [chatId, chat.data]);

    const onSend = () => {
        const text = editorRef.current?.getText();
        if (!text) {
            alert("Please enter a message");
            return;
        }

        const streamId = generateId();

        sendMessage(
            { text },
            {
                body: {
                    modelId: chatStore.selectedModel.id,
                    chatId: chat.data?._id,
                    streamId,
                },
            }
        );

        // for the history feature
        localStorage.setItem("chat-history", text);

        // clear the editor
        editorRef.current?.commands.setContent("");
    };

    useShortcut("Control+Enter", onSend);
    useShortcut("Command+Enter", onSend);

    if (!chat) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            <Conversation className="relative h-full w-full" isGenerating={status === "streaming"}>
                <ConversationContent className="mx-auto w-8/12 pb-64">
                    {messages.map((message) => (
                        <Message from={message.role} key={message.id}>
                            <MessageContent variant="flat">
                                {message.parts.map((part, i) => {
                                    switch (part.type) {
                                        case "text": // we don't use any reasoning or tool calls in this example
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
                className={cn("pointer-events-none absolute bottom-0 z-0 flex h-full w-full flex-col items-center")}
                style={{
                    justifyContent: "flex-end",
                    paddingBottom: "12px",
                }}
            >
                <motion.div
                    className="pointer-events-auto z-50 w-9/12 max-w-[900px] overflow-hidden rounded-xl border bg-gray-100"
                    layout
                    layoutId="chat"
                    transition={{
                        duration: 0.2,
                        ease: "easeInOut",
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
                                    <Shortcut nothen shortcut={["⌘", "↵"]} />
                                </Button>
                            </div>
                        </div>
                    </Chat.Root>
                </motion.div>
            </div>
        </div>
    );
});
