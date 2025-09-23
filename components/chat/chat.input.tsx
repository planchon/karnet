"use client";

import { MCP } from "@lobehub/icons";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import { Button } from "@ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Shortcut } from "@ui/shortcut";
import { observer } from "mobx-react";
import { useEffect, useImperativeHandle, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { type GeneralKarnetModel, groupedByProvider, ProviderIcons } from "@/ai/models";
import { commands } from "@/data/tools";
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

    function handleSelect(value: GeneralKarnetModel) {
        chatStore.setModel(value);
        setOpen(false);
        chatStore.setDropdownOpen(false);
        editorRef.current?.commands.focus();
    }

    return (
        <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild className="outline-none ring-0">
                <Button className="h-6 px-2 text-gray-700 outline-none ring-0" size="sm" variant="ghost">
                    <ProviderIcons provider={chatStore.selectedModel?.provider || ""} />
                    {chatStore.selectedModel ? chatStore.selectedModel.name : "Model"}
                    <Shortcut shortcut={["M"]} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search model..." />
                    <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
                        <CommandEmpty>No model found.</CommandEmpty>
                        {Object.entries(groupedByProvider).map(([provider, models]) => (
                            <CommandGroup heading={capitalize(provider)} key={provider}>
                                {models.map((m) => (
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

    function handleSelect(value: string) {
        chatStore.setMcp(value);
        setOpen(false);
        chatStore.setDropdownOpen(false);
        editorRef.current?.commands.focus();
    }

    function getRenderingName() {
        const mcpItem = commands
            .flatMap((provider) => provider.tools)
            .find((mcpItemIterator) => mcpItemIterator.id === chatStore.selectedMcp);
        return mcpItem?.name;
    }

    function getRenderingIcon() {
        const mcpItem = commands
            .flatMap((provider) => provider.tools)
            .find((mcpItemIterator) => mcpItemIterator.id === chatStore.selectedMcp);

        if (!mcpItem) {
            return <MCP className="size-4" />;
        }

        return <mcpItem.icon className="size-4" />;
    }

    return (
        <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild className="outline-none ring-0">
                <Button className="h-6 px-2 text-gray-700 outline-none ring-0" size="sm" variant="ghost">
                    {getRenderingIcon()}
                    {chatStore.selectedMcp ? getRenderingName() : "MCP"}
                    <Shortcut nothen shortcut={["S"]} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search MCP..." />
                    <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
                        <CommandEmpty>No MCP found.</CommandEmpty>
                        {commands.map((provider) => (
                            <CommandGroup heading={provider.name} key={provider.name}>
                                {provider.tools.map((item) => (
                                    <CommandItem key={item.id} onSelect={() => handleSelect(item.id)} value={item.id}>
                                        <item.icon />
                                        {item.name}
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
                            renderItems(ToolsSuggestionComponent, (props: { id?: string }) => {
                                if (!props.id) return;
                                chatStore.setMcp(props.id);
                            }),
                    },
                    {
                        char: "@",
                        render: () =>
                            renderItems(ModelSuggestionComponent, (props: { model?: GeneralKarnetModel }) => {
                                if (!props.model) return;
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

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                // biome-ignore lint/style/useBlockStatements: useless
                if (!editor) return;
                editor.commands.blur();
            }

            if (["/", " "].includes(e.key)) {
                e.preventDefault();
                // biome-ignore lint/style/useBlockStatements: useless
                if (!editor) return;
                editor.commands.focus();
            }

            if (e.key === "ArrowUp" && editor?.getText() === "" && editor.isFocused) {
                e.preventDefault();
                // biome-ignore lint/style/useBlockStatements: useless
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: mcp change every render
    useEffect(() => {
        document.addEventListener("keydown", modelMcpHandler);

        return () => {
            document.removeEventListener("keydown", modelMcpHandler);
        };
    }, []);

    // biome-ignore lint/style/useBlockStatements: useless
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
