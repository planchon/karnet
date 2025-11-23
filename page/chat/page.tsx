"use client";

import { useChat } from "@ai-sdk/react";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import type { Editor } from "@tiptap/react";
import { Button } from "@ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { useConvex, useMutation } from "convex/react";
import { motion } from "framer-motion";
import _ from "lodash";
import { Paperclip } from "lucide-react";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { FaArrowUpLong, FaCircleStop } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import type { ChatMessageBody } from "@/ai/schema/chat";
import { Chat } from "@/components/ai/chat";
import { ConversationComp } from "@/components/ai/conversation/conversation";
import { File, type FileWithUploadProcess } from "@/components/ui/file";
import { api } from "@/convex/_generated/api";
import { type KarnetModel, useModels } from "@/hooks/useModels";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useStores } from "@/hooks/useStores";
import { cn, generateId } from "@/lib/utils";

export const ChatPage = observer(function ChatPageComponent() {
    const { chatStore } = useStores();
    const location = useLocation();
    const navigate = useNavigate();

    const { chatId: paramChatId } = useParams<{ chatId: string }>();

    const [chatId, setChatId] = useState(paramChatId || generateId());
    const isNewChat = useRef(paramChatId === undefined || location.state?.nonce !== undefined);

    const client = useConvex();
    chatStore.client = client;

    const deleteFile = useMutation(api.functions.files.deleteFile);

    const chat = useQuery({
        ...convexQuery(api.functions.chat.getChat, {
            id: paramChatId ?? "skip",
        }),
        initialData: JSON.parse(localStorage.getItem(`chat:${paramChatId}`) || "null"),
    });

    const editorRef = useRef<Editor | null>(null);
    const { models } = useModels();
    const inputRef = useRef<HTMLInputElement>(null);
    const selectedModel = useRef<KarnetModel | undefined>(undefined);
    const [inputPosition, setInputPosition] = useState<"center" | "bottom">(isNewChat.current ? "center" : "bottom");

    const title = chat.data?.title || "New Chat";
    usePageTitle(`${title} - Karnet AI Assistant`);

    const { messages, sendMessage, setMessages, stop, status, regenerate } = useChat({
        id: chatId,
        resume: !isNewChat,
        experimental_throttle: 200,
    });

    useEffect(() => {
        if (status === "streaming" || status === "error") return;

        if (paramChatId && chat.data) {
            isNewChat.current = false;
            setChatId(paramChatId);
            setInputPosition("bottom");

            const parsedMessage = chat.data.messages.map((m) => ({
                role: m.role,
                id: m.id,
                parts: JSON.parse(m.parts),
                metadata: m.metadata ? JSON.parse(m.metadata) : undefined,
            }));
            setMessages(parsedMessage);

            localStorage.setItem(`chat:${chatId}`, JSON.stringify(chat.data));
            return;
        }

        if (location.state?.nonce) {
            isNewChat.current = true;
            setChatId(location.state.nonce);
            setInputPosition("center");

            stop();

            setMessages([]);
            return;
        }
    }, [chatId, paramChatId, chat.data, location.state?.nonce]);

    // i for insert like in vim
    useHotkeys("i, t", () => {
        editorRef.current?.commands.focus();
    });

    useEffect(() => {
        document.addEventListener("keydown", listenToEnter, { capture: true });
        document.addEventListener("keydown", listenToNewChat, { capture: true });
        return () => {
            document.removeEventListener("keydown", listenToEnter, { capture: true });
            document.removeEventListener("keydown", listenToNewChat, { capture: true });
        };
    }, [chatId]);

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
            chatId,
            streamId: generateId(),
            // TODO: get the used tools from the message (could be differents)
            tools: chatStore.selectedTool,
        };

        return regenerate({
            ...args,
            body: {
                ...args?.body,
                ...body,
            },
        });
    };

    useEffect(() => {
        selectedModel.current = chatStore.selectedModel || models.find((m) => m.default && chatStore.canUseModel(m));
    }, [chatStore.selectedModel, chatStore.canUseModel, models, chatStore.selectedTool.includes("image")]);

    // we try to not block anything on the UI thread
    // we want to have the message rendered immediately
    const onSend = useCallback(() => {
        if (!chatStore.allFilesAreUploaded()) {
            alert("Please wait for the files to be uploaded");
            return;
        }

        if (isNewChat.current) {
            window.history.pushState({}, "", `/chat/${chatId}`);
        }

        if (!selectedModel.current) {
            alert("Please select a model");
            return;
        }

        setInputPosition("bottom");

        const text = editorRef.current?.getText();

        if (!text) {
            alert("Please enter a message");
            return;
        }

        // for the history feature - sauvegarder dans un tableau
        const historyStr = localStorage.getItem("chat-history");
        let history: string[] = [];

        try {
            history = historyStr ? JSON.parse(historyStr) : [];
        } catch (error) {
            console.error("error parsing history", error);
            localStorage.removeItem("chat-history");
            history = [];
        }

        // Ajouter le nouveau prompt à la fin (éviter les doublons consécutifs)
        if (history.at(-1) !== text) {
            history.push(text);
            // Limiter à 50 prompts maximum
            if (history.length > 50) {
                history.shift();
            }
            localStorage.setItem("chat-history", JSON.stringify(history));
        }

        const tools = _.cloneDeep(chatStore.selectedTool);

        // clear the editor
        editorRef.current?.commands.setContent("");

        const streamId = generateId();

        sendMessage(
            {
                text,
                files: chatStore.getFilesForChat(),
            },
            {
                body: {
                    model: selectedModel.current,
                    chatId,
                    streamId,
                    tools: tools || [],
                } satisfies Omit<ChatMessageBody, "messages">,
            }
        );

        // replace the url without navigate because we dont want to trigger a re-render
        // this would trigger flickering on the messages
        chatStore.resetFiles();
    }, [chatStore, chatId, selectedModel, sendMessage]);

    const listenToNewChat = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "c" && !editorRef.current?.isFocused) {
                isNewChat.current = true;
                setChatId(generateId());
                setInputPosition("center");
                stop();
                setMessages([]);
                return;
            }
        },
        [chatId, isNewChat]
    );

    const listenToEnter = useCallback(
        (e: KeyboardEvent) => {
            if (chatStore.toolDropdownOpen) return;

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
        },
        [onSend, chatStore.toolDropdownOpen]
    );

    const removeFile = (file: FileWithUploadProcess) => {
        if (file.upload === "success") {
            deleteFile({ id: file.id }).catch(() => {
                toast.error("Error deleting file");
            });
        }
        chatStore.removeFile(file);
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
                        <div className="relative h-full w-full rounded-b-xl bg-white p-2 shadow-md">
                            {chatStore.getFiles().length > 0 && (
                                <div className="flex w-full flex-row flex-wrap gap-2 pb-3">
                                    {chatStore.getFiles().map((file) => (
                                        <File file={file} key={file.file.name} onRemove={() => removeFile(file)} />
                                    ))}
                                </div>
                            )}
                            <Chat.Input className="h-auto max-h-96 min-h-20 overflow-y-auto" ref={editorRef} />
                            <div className="absolute right-0 bottom-0 p-1">
                                <input
                                    accept="application/pdf, image/*"
                                    className="hidden"
                                    multiple
                                    onChange={(e) => chatStore.handleFileInput(e)}
                                    ref={inputRef}
                                    type="file"
                                    value=""
                                />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="flex items-center gap-2 overflow-hidden rounded-full bg-gray-50 p-2 hover:cursor-pointer"
                                            onClick={() => inputRef.current?.click()}
                                            type="button"
                                        >
                                            <Paperclip className="size-4 text-gray-500" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5}>
                                        <span>Attach files to your message</span>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="flex w-full justify-between p-2 py-0 pt-3 pl-1">
                            <div className="flex items-center gap-0">
                                <Chat.ModelSelect editorRef={editorRef} />
                            </div>
                            <div className="flex items-center gap-2 pb-2">
                                <Chat.MCPSelect editorRef={editorRef} />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="size-8 rounded-sm"
                                            disabled={!chatStore.allFilesAreUploaded()}
                                            onClick={() => {
                                                if (status === "streaming") {
                                                    stop();
                                                } else {
                                                    onSend();
                                                }
                                            }}
                                            size="icon"
                                        >
                                            {status === "streaming" ? (
                                                <FaCircleStop className="size-4" />
                                            ) : (
                                                <FaArrowUpLong className="size-4" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={5}>
                                        <span>
                                            {status === "streaming" ? "Stop the generation" : "Send the message"}
                                        </span>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </Chat.Root>
                </motion.div>
            </div>
        </div>
    );
});
