"use client";

import { useUploadFile } from "@convex-dev/r2/react";
import { IconWorld } from "@tabler/icons-react";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import { Button } from "@ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@ui/command";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Shortcut } from "@ui/shortcut";
import { useMutation } from "convex/react";
import { CheckIcon, Globe, GlobeIcon, GlobeLockIcon, Wrench } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useImperativeHandle, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ProviderIcons } from "@/ai/models";
import type { ChatMessageBody } from "@/ai/schema/chat";
import { isImageGeneratingModel } from "@/ai/schema/model";
import { commands } from "@/ai/tools";
import { api } from "@/convex/_generated/api";
import { type KarnetModel, useModels } from "@/hooks/useModels";
import { useStores } from "@/hooks/useStores";
import { capitalize, cn } from "@/lib/utils";
import { RewriteEnter } from "./extensions/enter";
import { ModelSuggestionComponent } from "./extensions/model-suggestion";
import { renderItems } from "./extensions/textual-commands";
import { ToolsSuggestionComponent } from "./extensions/tools-suggestion";

export const ChatModelSelect = observer(function ChatModelSelectInner({
    editorRef,
}: {
    editorRef: React.RefObject<Editor | null>;
}) {
    const { chatStore } = useStores();
    const [open, setOpen] = useState(false);
    const { models } = useModels();

    useHotkeys(
        "m",
        () => {
            setOpen(true);
            chatStore.setDropdownOpen(true);
        },
        {
            preventDefault: true,
            useKey: true,
        }
    );

    function focusEditor() {
        if (!editorRef.current?.isFocused) {
            editorRef.current?.commands.focus();
        }
    }

    function handleSelect(value: KarnetModel) {
        chatStore.setModel(value);
        setOpen(false);
        chatStore.setDropdownOpen(false);
        focusEditor();
    }

    function toggleDropdown(isOpen: boolean) {
        setOpen(isOpen);
        chatStore.setDropdownOpen(isOpen);
        if (!isOpen) {
            focusEditor();
        }
    }

    const groupedByProvider = models
        .filter((model) => model.active)
        .reduce(
            (acc, model) => {
                acc[model.provider] = acc[model.provider] || [];
                acc[model.provider].push(model);
                return acc;
            },
            {} as Record<string, KarnetModel[]>
        );

    const defaultModel = models.find((model) => model.default && chatStore.canUseModel(model));

    return (
        <Popover onOpenChange={toggleDropdown} open={open}>
            <PopoverTrigger asChild className="outline-none ring-0">
                <Button className="h-6 px-2 text-gray-700 outline-none ring-0" size="sm" variant="ghost">
                    <ProviderIcons provider={chatStore.selectedModel?.provider || defaultModel?.provider || ""} />
                    {chatStore.selectedModel ? chatStore.selectedModel.name : defaultModel?.name || "No model selected"}
                    <Shortcut shortcut={["M"]} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full p-0"
                onEscapeKeyDown={(e) => {
                    toggleDropdown(false);
                    e.stopPropagation();
                }}
                side="top"
            >
                <Command>
                    <CommandInput placeholder="Search model..." />
                    <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
                        <CommandEmpty>No model found.</CommandEmpty>
                        {Object.entries(groupedByProvider).map(([provider, providerModels]) => (
                            <CommandGroup className="py-0" heading={capitalize(provider)} key={provider}>
                                {providerModels.map((m) => (
                                    <CommandItem key={m.id} onSelect={() => handleSelect(m)} value={m.id}>
                                        <ProviderIcons provider={provider} />
                                        {m.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
});

export const ChatMCPSelect = observer(function ChatMcpSelectInner({
    editorRef,
}: {
    editorRef: React.RefObject<Editor | null>;
}) {
    const { chatStore } = useStores();

    const isDisabled = isImageGeneratingModel(chatStore.selectedModel);
    const isSelected = chatStore.selectedTool.includes("web");
    const SearchIcon = isSelected ? <GlobeIcon className="size-4" /> : <GlobeLockIcon className="size-4" />;

    return (
        <div className="relative flex items-center">
            <Button
                className={cn(
                    "h-7 rounded-full px-2 text-gray-600 outline-none ring-0 transition-all duration-100 hover:cursor-pointer hover:bg-gray-200/60",
                    chatStore.selectedTool.includes("web") && "bg-gray-200 text-gray-800"
                )}
                disabled={isDisabled}
                onClick={() => {
                    chatStore.toggleTool("web");
                }}
                size="sm"
                variant="ghost"
            >
                {SearchIcon}
                Search
            </Button>
        </div>
    );
});

export const ChatInput = observer(function ChatInputInside({
    className,
    onChange,
    ref,
}: {
    className?: string;
    onChange?: (value: string) => void;
    ref?: React.RefObject<Editor | null>;
}) {
    const { chatStore } = useStores();
    const uploadFile = useUploadFile(api.functions.files);
    const assignFile = useMutation(api.functions.files.assignFileToUser);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            Document.configure({
                HTMLAttributes: {
                    class: "text-sm!",
                },
            }),
            Paragraph.configure({
                HTMLAttributes: {
                    class: "min-h-4 mt-0",
                    // the tailwind text-sm! is not working here
                    style: "font-size: 13px;",
                },
            }),
            Text.configure({
                HTMLAttributes: {
                    class: "text-sm! min-h-4",
                },
            }),
            Placeholder.configure({
                placeholder: "use / for commands and @ for entities",
            }),
            Mention.configure({
                suggestions: [
                    {
                        char: "/",
                        render: () =>
                            renderItems(
                                ToolsSuggestionComponent,
                                (props: { id?: ChatMessageBody["tools"][number] }) => {
                                    if (!props.id) {
                                        return;
                                    }
                                    chatStore.toggleTool(props.id);
                                }
                            ),
                    },
                    {
                        char: "@",
                        render: () =>
                            renderItems(ModelSuggestionComponent, (props: { model?: KarnetModel }) => {
                                if (!props.model) {
                                    return;
                                }
                                chatStore.setModel(props.model);
                            }),
                    },
                ],
            }),
            RewriteEnter,
        ],
        autofocus: "start",
        content: "",
        editorProps: {
            attributes: {
                style: "font-size: 13px;",
            },
            handlePaste: (_view, event) => {
                // check if the paste is an image
                if (event?.clipboardData?.files?.length && event.clipboardData.files.length > 0) {
                    const file = event.clipboardData?.files[0];
                    if (file) {
                        chatStore.addFiles([{ file, upload: "in_progress" }]);

                        uploadFile(file).then(async (id) => {
                            // move to the convex id
                            const { url, id: cid } = await assignFile({
                                id,
                                media_type: file.type,
                                filename: file.name,
                            });
                            chatStore.updateFile({ file, upload: "success" as const, id: cid, url });
                        });
                    }
                    return true;
                }
            },
        },
        onUpdate: ({ editor: e }) => {
            const text = e.getText();
            onChange?.(text);
        },
    });

    // @ts-expect-error
    useImperativeHandle(ref, () => editor);

    useHotkeys(
        "esc",
        () => {
            if (!editor) return;
            if (!editor?.isFocused) return;
            if (editor.getText() !== "") return;
            editor.commands.blur();
        },
        {
            enableOnContentEditable: true,
        }
    );

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp" && editor?.getText() === "" && editor.isFocused) {
                e.preventDefault();
                if (!editor) return;

                const history = localStorage.getItem("chat-history");
                if (history) {
                    editor.commands.insertContent(history);
                }
            }
        });
    }, [editor]);

    const modelMcpHandler = (e: KeyboardEvent) => {
        if (editor?.isFocused) {
            return;
        }

        if (e.key === "g" || e.key === "c") {
            return;
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", modelMcpHandler);

        return () => {
            document.removeEventListener("keydown", modelMcpHandler);
        };
    }, []);

    if (!editor) return null;

    return (
        <EditorContent
            className={cn("h-auto w-full cursor-text text-sm!", className)}
            editor={editor}
            onClick={() => {
                editor.commands.focus();
            }}
        />
    );
});
