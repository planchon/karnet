"use client";

import { useChat } from "@ai-sdk/react";
import { IconSend } from "@tabler/icons-react";
import type { Editor } from "@tiptap/react";
import { Button } from "@ui/button";
import { Shortcut } from "@ui/shortcut";
import { generateId } from "ai";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";
import { Chat } from "@/components/chat";
import { ConversationComp } from "@/components/conversation/conversation";
import { api } from "@/convex/_generated/api";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useStores } from "@/hooks/useStores";
import { cn } from "@/lib/utils";

export const NewChatPage = observer(function ChatPage() {
    const { chatStore } = useStores();
    const navigate = useNavigate();
    const location = usePathname();
    const editorRef = useRef<Editor | null>(null);
    const createEmptyChat = useMutation(api.functions.chat.createEmptyChat);

    usePageTitle("New Chat - Karnet AI Assistant");

    const { messages, sendMessage, setMessages, stop, status } = useChat({
        // biome-ignore lint/style/useNamingConvention: i dont control the API
        experimental_throttle: 200,
    });

    const [inputPosition, setInputPosition] = useState<"center" | "bottom">("center");

    // i want to keep the animation when im on the chat page
    useEffect(() => {
        if (location === "/chat") {
            setInputPosition("center");
            stop();
            setMessages([]);
        }
    }, [location, stop, setMessages]);

    useHotkeys("t", () => {
        editorRef.current?.commands.focus();
    });

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

    const onSend = async () => {
        setInputPosition("bottom");

        const text = editorRef.current?.getText();
        if (!text) {
            // biome-ignore lint/suspicious/noAlert: alert is used for UX
            alert("Please enter a message");
            return;
        }

        localStorage.setItem("chat-history", text);

        // clear the editor
        editorRef.current?.commands.setContent("");
        chatStore.resetMcp();

        const streamId = generateId();

        const chat = await createEmptyChat({
            model: {
                id: chatStore.selectedModel.id,
                name: chatStore.selectedModel.name,
                provider: chatStore.selectedModel.provider,
            },
            userInputMessage: text,
            streamId,
        });

        sendMessage(
            { text },
            {
                body: {
                    modelId: chatStore.selectedModel.id,
                    chatId: chat._id,
                    streamId,
                    webSearch: chatStore.selectedMcp === "search",
                },
            }
        );

        navigate(`/chat/${chat._id}`, { replace: true });
    };

    return (
        <div className="flex h-full w-full flex-col">
            <ConversationComp messages={messages} status={status} />
            <div
                className={cn("pointer-events-none absolute bottom-0 z-0 flex h-full w-full flex-col items-center")}
                style={{
                    justifyContent: inputPosition === "center" ? "center" : "flex-end",
                    paddingBottom: inputPosition === "center" ? "0px" : "12px",
                }}
            >
                <motion.div
                    className="pointer-events-auto z-50 h-auto w-9/12 max-w-[900px] overflow-hidden rounded-xl border bg-gray-100"
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
