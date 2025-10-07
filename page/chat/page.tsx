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
import { Chat } from "@/components/ai/chat";
import { ConversationComp } from "@/components/ai/conversation/conversation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { type KarnetModel, useModels } from "@/hooks/useModels";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useStores } from "@/hooks/useStores";
import { cn } from "@/lib/utils";

export const NewChatPage = observer(function ChatPage() {
    const { chatStore } = useStores();
    const location = usePathname();
    const editorRef = useRef<Editor | null>(null);
    const createEmptyChat = useMutation(api.functions.chat.createEmptyChat);
    const chatId = useRef<Id<"chats"> | null>(null);
    const { models } = useModels();

    usePageTitle("New Chat - Karnet AI Assistant");

    const { messages, sendMessage, setMessages, stop, status, regenerate } = useChat({
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

    // we get the "New chat" from the user when the page is loaded.
    // that way we dont have to wait when a message is sent
    useEffect(() => {
        const fetchChat = async () => {
            const newChat = await createEmptyChat();
            const id = newChat._id;
            chatId.current = id;
        };
        fetchChat();
    }, [createEmptyChat]);

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

    const regenerateMessage: typeof regenerate = (
        args: Parameters<typeof regenerate>[0],
        overrideModel?: KarnetModel
    ) => {
        const messageId = args?.messageId;
        const message = messages.find((m) => m.id === messageId);
        // @ts-expect-error
        const modelId = message?.metadata?.model.id;
        const model = overrideModel || models.find((m) => m.id === modelId);

        const body = {
            model: JSON.parse(JSON.stringify(model)),
            chatId: chatId.current,
            streamId: generateId(),
            webSearch: chatStore.selectedMcp === "search",
        };

        return regenerate({
            ...args,
            body: {
                ...args?.body,
                ...body,
            },
        });
    };

    // we try to not block anything on the UI thread
    // we want to have the message rendered immediately
    const onSend = () => {
        if (!chatId.current) {
            return;
        }

        const model = chatStore.selectedModel || models.find((m) => m.default);
        if (!model) {
            // biome-ignore lint/suspicious/noAlert: please
            alert("Please select a model");
            return;
        }

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

        sendMessage(
            { text },
            {
                body: {
                    model,
                    chatId: chatId.current,
                    streamId,
                    webSearch: chatStore.selectedMcp === "search",
                },
            }
        );

        // replace the url without navigate because we dont want to trigger a re-render
        // this would trigger flickering on the messages
        window.history.replaceState({}, "", `/chat/${chatId.current}`);
    };

    return (
        <div className="flex h-full w-full flex-col">
            <ConversationComp messages={messages} regenerate={regenerateMessage} status={status} />
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
                                <Button
                                    className="h-8 rounded-sm pr-[6px]! pl-[8px]!"
                                    disabled={!chatId.current}
                                    onClick={() => onSend()}
                                >
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
