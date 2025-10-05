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
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Loader } from "@/components/ai/ai-elements/loader";
import { Chat } from "@/components/ai/chat";
import { ConversationComp } from "@/components/ai/conversation/conversation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useStores } from "@/hooks/useStores";

const DEBOUNCE_TIME = 5000;

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

    usePageTitle(`${chat.data?.title} - Karnet AI Assistant`);

    const { messages, sendMessage, setMessages, status } = useChat({
        id: chatId as Id<"chats">,
        resume: true,
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
        const debouncedSetLocalStorage = debounce(() => {
            localStorage.setItem(`chat:${chatId}`, JSON.stringify(chat.data));
        }, DEBOUNCE_TIME);
        debouncedSetLocalStorage();
    }, [chatId, chat.data]);

    const listenToEnter = (e: KeyboardEvent) => {
        if (
            e.key === "Enter" &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.shiftKey &&
            editorRef.current?.isFocused &&
            editorRef.current?.getText() !== "" &&
            !chatStore.dropdownOpen
        ) {
            e.preventDefault();
            onSend();
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: this is false
    useEffect(() => {
        document.addEventListener("keydown", listenToEnter, { capture: true });
        return () => {
            document.removeEventListener("keydown", listenToEnter, { capture: true });
        };
    }, []);

    const onSend = () => {
        if (!chatStore.selectedModel) {
            // biome-ignore lint/suspicious/noAlert: please
            alert("Please select a model");
            return;
        }

        const text = editorRef.current?.getText();
        if (!text) {
            // biome-ignore lint/suspicious/noAlert: alert is used for UX
            alert("Please enter a message");
            return;
        }

        // for the history feature
        localStorage.setItem("chat-history", text);

        // clear the editor
        editorRef.current?.commands.setContent("");

        const streamId = generateId();

        sendMessage(
            { text },
            {
                body: {
                    model: chatStore.selectedModel,
                    chatId: chatId as Id<"chats">,
                    streamId,
                    webSearch: chatStore.selectedMcp === "search",
                },
            }
        );
    };

    if (!chat) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            <ConversationComp messages={messages} status={status} />
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
                            <Chat.Input className="h-auto max-h-96 min-h-20 overflow-y-auto" ref={editorRef} />
                        </div>
                        <div className="flex w-full justify-between p-2 py-0 pt-3 pl-1">
                            <div className="flex items-center gap-0">
                                <Chat.ModelSelect editorRef={editorRef} />
                                <Chat.MCPSelect editorRef={editorRef} />
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
