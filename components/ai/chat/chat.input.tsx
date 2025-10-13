"use client";

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
import { CheckIcon, Wrench } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ProviderIcons } from "@/ai/models";
import type { ChatMessageBody } from "@/ai/schema/chat";
import { commands } from "@/ai/tools";
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
    const [open, setOpen] = useState(false);

    useHotkeys(
        "s",
        () => {
            setOpen(true);
            chatStore.setDropdownOpen(true);
        },
        {
            preventDefault: true,
            useKey: true,
        }
    );

    function handleSelect(value: ChatMessageBody["tools"][number]) {
        chatStore.toggleTool(value);
    }

    function toggleDropdown(isOpen: boolean) {
        setOpen(isOpen);
        chatStore.setDropdownOpen(isOpen);
        if (!isOpen) {
            editorRef.current?.commands.focus();
        }
    }

    function getRenderingNames() {
        if (chatStore.selectedTool.length === 0) {
            return "No tools";
        }

        return commands
            .filter((f) => chatStore.selectedTool.includes(f.id))
            .map((f) => f.name)
            .join(", ");
    }

    function getRenderingIcons() {
        if (chatStore.selectedTool.length === 0) {
            return <Wrench className="size-4" />;
        }

        if (chatStore.selectedTool.length === 1) {
            const command = commands.find((f) => chatStore.selectedTool.includes(f.id));
            if (!command) {
                return <Wrench className="size-4" />;
            }

            return <command.icon className="size-4" key={command.id} />;
        }

        const allIconsSelected = commands.filter((f) => chatStore.selectedTool.includes(f.id));

        return (
            <div className="-space-x-2 flex items-center">
                {allIconsSelected.map((command) => (
                    <command.icon className="size-5 rounded-full border bg-white p-[2px]" key={command.id} />
                ))}
            </div>
        );
    }

    return (
        <div className="relative flex items-center">
            <Popover onOpenChange={toggleDropdown} open={open}>
                <PopoverAnchor className="absolute top-[-2px] left-15" />
                <PopoverTrigger asChild className="outline-none ring-0">
                    <Button className="h-6 px-2 text-gray-700 outline-none ring-0" size="sm" variant="ghost">
                        {getRenderingIcons()}
                        {getRenderingNames()}
                        <Shortcut nothen shortcut={["s"]} />
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
                        <CommandInput placeholder="Search tools..." />
                        <CommandList className="scrollbar-thin flex max-h-48 flex-col gap-1 overflow-y-auto px-1 pt-1">
                            <CommandEmpty>No tools found.</CommandEmpty>
                            {chatStore.getAvailableTools().map((command) => (
                                <CommandItem
                                    className="flex justify-between"
                                    disabled={command.disabled}
                                    key={command.id}
                                    onSelect={() => handleSelect(command.id)}
                                    value={command.name}
                                >
                                    <div className="flex items-center gap-2">
                                        <command.icon />
                                        {command.name}
                                    </div>
                                    {chatStore.selectedTool.includes(command.id) && <CheckIcon className="size-4" />}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
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
        },
        onUpdate: ({ editor: e }) => {
            const text = e.getText();
            onChange?.(text);
        },
    });

    // @ts-expect-error
    useImperativeHandle(ref, () => editor);

    const escapeCount = useRef(0);
    useHotkeys(
        "esc",
        () => {
            escapeCount.current++;
            setTimeout(() => {
                escapeCount.current = 0;
            }, 300);
            if (escapeCount.current < 2) {
                return;
            }

            if (!editor) return;
            if (!editor?.isFocused) return;
            editor.commands.blur();
        },
        {
            enableOnContentEditable: true,
        }
    );

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "/") {
                e.preventDefault();
                if (!editor) return;
                editor.commands.focus();
            }

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
