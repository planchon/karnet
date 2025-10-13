"use client";

import { useChat } from "@ai-sdk/react";
import { useUploadFile } from "@convex-dev/r2/react";
import { IconSend } from "@tabler/icons-react";
import type { Editor } from "@tiptap/react";
import { Button } from "@ui/button";
import { Shortcut } from "@ui/shortcut";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { generateId } from "ai";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import _ from "lodash";
import { Paperclip } from "lucide-react";
import { observer } from "mobx-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { ChatMessageBody } from "@/ai/schema/chat";
import { Chat } from "@/components/ai/chat";
import { ConversationComp } from "@/components/ai/conversation/conversation";
import { File, type FileWithUploadProcess } from "@/components/ui/file";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { type KarnetModel, useModels } from "@/hooks/useModels";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useStores } from "@/hooks/useStores";
import { cn } from "@/lib/utils";

export const NewChatPage = observer(function ChatPage() {
    const uploadFile = useUploadFile(api.functions.files);
    const deleteFile = useMutation(api.functions.files.deleteFile);
    const assignFile = useMutation(api.functions.files.assignFileToUser);
    const createEmptyChat = useMutation(api.functions.chat.createEmptyChat);

    const { chatStore } = useStores();
    const location = usePathname();
    const editorRef = useRef<Editor | null>(null);
    const chatId = useRef<Id<"chats"> | null>(null);
    const { models } = useModels();
    const inputRef = useRef<HTMLInputElement>(null);

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
            fetchChat();
            setMessages([]);
        }
    }, [location, stop, setMessages]);

    const fetchChat = async () => {
        const newChat = await createEmptyChat();
        const id = newChat._id;
        chatId.current = id;
    };

    // we get the "New chat" from the user when the page is loaded.
    // that way we dont have to wait when a message is sent
    useEffect(() => {
        fetchChat();
    }, []);

    // i for insert like in vim
    useHotkeys("i, t", () => {
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

    // we try to not block anything on the UI thread
    // we want to have the message rendered immediately
    const onSend = () => {
        if (!chatStore.allFilesAreUploaded()) {
            alert("Please wait for the files to be uploaded");
            return;
        }

        if (!chatId.current) {
            alert("Please wait for the ID to be generated");
            return;
        }

        const model = chatStore.selectedModel || models.find((m) => m.default && chatStore.canUseModel(m));
        if (!model) {
            alert("Please select a model");
            return;
        }

        if (!chatStore.allFilesAreUploaded()) {
            alert("wait for all the file to be uploaded");
            return;
        }

        setInputPosition("bottom");

        const text = editorRef.current?.getText();
        if (!text) {
            alert("Please enter a message");
            return;
        }

        localStorage.setItem("chat-history", text);

        const tools = _.cloneDeep(chatStore.selectedTool);
        chatStore.resetTools();

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
                    model,
                    chatId: chatId.current as Id<"chats">,
                    streamId,
                    tools: tools || [],
                } satisfies Omit<ChatMessageBody, "messages">,
            }
        );

        // replace the url without navigate because we dont want to trigger a re-render
        // this would trigger flickering on the messages
        window.history.replaceState({}, "", `/chat/${chatId.current}`);
        chatStore.resetFiles();
    };

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Object.values(e.target.files || {}).map((file) => ({
            file,
            upload: "in_progress" as const,
        }));
        chatStore.addFiles(newFiles);
        e.target.value = "";

        // upload all the files
        for (const file of newFiles) {
            uploadFile(file.file).then(async (id) => {
                // move to the convex id
                const { url, id: cid } = await assignFile({ id, media_type: file.file.type, filename: file.file.name });
                chatStore.updateFile({ ...file, upload: "success" as const, id: cid, url });
            });
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
                                    disabled={!chatStore.allFilesAreUploaded()}
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
