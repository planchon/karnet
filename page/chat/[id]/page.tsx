"use client";

import { useChat } from "@ai-sdk/react";
import { useUploadFile } from "@convex-dev/r2/react";
import { convexQuery } from "@convex-dev/react-query";
import { IconSend } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { Editor } from "@tiptap/core";
import { Button } from "@ui/button";
import { Shortcut } from "@ui/shortcut";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { generateId } from "ai";
import { useConvex, useMutation } from "convex/react";
import { motion } from "framer-motion";
import _, { debounce } from "lodash";
import { Paperclip } from "lucide-react";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "react-router";
import { Loader } from "@/components/ai/ai-elements/loader";
import { Chat } from "@/components/ai/chat";
import { ConversationComp } from "@/components/ai/conversation/conversation";
import type { FileWithUploadProcess } from "@/components/ui/file";
import { File } from "@/components/ui/file";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { type KarnetModel, useModels } from "@/hooks/useModels";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useStores } from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import type { Regenerate } from "@/types/regenerate";

const DEBOUNCE_TIME = 5000;

export const ChatWithIdPage = observer(function ChatPage() {
    // const uploadFile = useUploadFile(api.functions.files);
    const deleteFile = useMutation(api.functions.files.deleteFile);
    // const assignFile = useMutation(api.functions.files.assignFileToUser);
    const generateImageUploadUrl = useMutation(api.functions.files.generateImageUploadUrl);
    const client = useConvex();

    const { chatId } = useParams();
    const { chatStore } = useStores();
    const editorRef = useRef<Editor | null>(null);
    const { models } = useModels();
    const chat = useQuery({
        ...convexQuery(api.functions.chat.getChat, {
            id: chatId as Id<"chats">,
        }),
        initialData: JSON.parse(localStorage.getItem(`chat:${chatId}`) || "null"),
    });
    const streamId = useRef<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const sendingDisabled = !chatStore.allFilesAreUploaded();

    usePageTitle(`${chat.data?.title} - Karnet AI Assistant`);

    const { messages, sendMessage, setMessages, status, regenerate } = useChat({
        id: chatId as Id<"chats">,
        resume: true,
        experimental_throttle: 200,
    });

    useHotkeys("i, t", () => {
        editorRef.current?.commands.focus();
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
    }, [chatId]);

    const regenerateMessage: Regenerate = (args: Parameters<typeof regenerate>[0], overrideModel?: KarnetModel) => {
        const messageId = args?.messageId;
        const message = messages.find((m) => m.id === messageId);
        // @ts-expect-error
        const modelId = message?.metadata?.model.id;
        const model = overrideModel || models.find((m) => m.id === modelId);

        const body = {
            model: JSON.parse(JSON.stringify(model)),
            chatId: chatId as Id<"chats">,
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

    const onSend = useCallback(() => {
        if (sendingDisabled) {
            alert("Please wait for the files to be uploaded");
            return;
        }

        const model = chatStore.selectedModel || models.find((m) => m.default);
        if (!model) {
            alert("Please select a model");
            return;
        }

        const text = editorRef.current?.getText();
        if (!text) {
            alert("Please enter a message");
            return;
        }

        // for the history feature - sauvegarder dans un tableau
        const historyStr = localStorage.getItem("chat-history-array");
        const history: string[] = historyStr ? JSON.parse(historyStr) : [];

        // Ajouter le nouveau prompt à la fin (éviter les doublons consécutifs)
        if (history[history.length - 1] !== text) {
            history.push(text);
            // Limiter à 50 prompts maximum
            if (history.length > 50) {
                history.shift();
            }
            localStorage.setItem("chat-history-array", JSON.stringify(history));
        }

        // Garder la compatibilité avec l'ancien format
        localStorage.setItem("chat-history", text);

        const tools = _.cloneDeep(chatStore.selectedTool);
        chatStore.resetTools();

        // clear the editor
        editorRef.current?.commands.setContent("");

        streamId.current = generateId();

        sendMessage(
            {
                text,
                files: chatStore.getFilesForChat(),
            },
            {
                body: {
                    model,
                    chatId: chatId as Id<"chats">,
                    streamId: streamId.current,
                    tools: tools || [],
                },
            }
        );

        chatStore.resetFiles();
    }, [chatId, chatStore, models, sendMessage]);

    if (!chat) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Object.values(e.target.files || {}).map((file) => ({
            file,
            upload: "in_progress" as const,
        }));
        chatStore.addFiles(newFiles);
        e.target.value = "";

        // upload all the files
        for (const file of newFiles) {
            const uploadUrl = await generateImageUploadUrl({});
            const uploadResponse = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "Content-Type": file.file.type,
                },
                body: file.file,
            });
            const { storageId } = await uploadResponse.json();
            const { url } = await client.query(api.functions.files.getImageUrl, { id: storageId });
            if (!url) {
                console.error("error getting image url", storageId);
                continue;
            }
            chatStore.updateFile({ ...file, upload: "success" as const, id: storageId, url });
        }
    };

    const removeFile = (file: FileWithUploadProcess) => {
        if (file.upload === "success") {
            deleteFile({ id: file.id }).catch((error) => {
                console.error("error deleting file", error);
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
                                    onChange={handleFiles}
                                    ref={inputRef}
                                    type="file"
                                    // to upload the same file multiple times
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
                                <Chat.MCPSelect editorRef={editorRef} />
                            </div>
                            <div className="pb-2">
                                <Button
                                    className="h-8 rounded-sm pr-[6px]! pl-[8px]!"
                                    disabled={sendingDisabled}
                                    onClick={onSend}
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
