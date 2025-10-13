"use client";

import type { Editor, Range } from "@tiptap/react";
import { Command, CommandEmpty, CommandItem, CommandList } from "@ui/command";
import { Command as Cmd } from "cmdk";
import { CheckIcon } from "lucide-react";
import { eventNames } from "process";
import React, { useEffect, useState } from "react";
import { FaImage, FaInternetExplorer, FaReact } from "react-icons/fa";
import { commands } from "@/ai/tools";
import { useStores } from "@/hooks/useStores";

export const ToolsSuggestion = [
    {
        group: "Search",
        items: [
            {
                title: "Web",
                icon: FaInternetExplorer,
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor.chain().focus().deleteRange(range).run();
                },
            },
            {
                title: "Image",
                icon: FaImage,
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor.chain().focus().deleteRange(range).run();
                },
            },
        ],
    },
    {
        group: "MCP",
        items: [
            {
                title: "React",
                icon: FaReact,
                command: ({ editor, range }: { editor: Editor; range: Range }) => {
                    editor.chain().focus().deleteRange(range).run();
                },
            },
        ],
    },
];

export const navigationKeys = ["ArrowUp", "ArrowDown", "Enter", "Space"];

type ToolsSuggestionComponentProps = {
    query: string;
    range: Range;
    editor: Editor;
    callback: (props: { id: string }) => void;
};

export const ToolsSuggestionComponent = (props: ToolsSuggestionComponentProps) => {
    const [query, setQuery] = useState("");
    const ref = React.useRef<HTMLDivElement>(null);
    const { chatStore } = useStores();

    const callback = props.callback;

    const onChange = (q: string) => {
        setQuery(q);
    };

    useEffect(() => {
        setQuery(props.query);
    }, [props.query]);

    useEffect(() => {
        const abortController = new AbortController();

        document.addEventListener(
            "keydown",
            (event) => {
                if (navigationKeys.includes(event.key)) {
                    // prevent default behavior of the key
                    event.preventDefault();

                    if (ref.current) {
                        // dispatch the keydown event to the slash command
                        ref.current.dispatchEvent(
                            new KeyboardEvent("keydown", {
                                key: event.key,
                                cancelable: true,
                                bubbles: true,
                            })
                        );

                        return false;
                    }
                }
            },
            {
                signal: abortController.signal,
            }
        );

        return () => {
            abortController.abort();
        };
    }, []);

    const handleSelect = (id: string) => {
        props.editor.chain().focus().deleteRange(props.range).run();
        callback({
            id,
        });
    };

    return (
        <Command
            className="min-w-[200px] border"
            onKeyDown={(e) => {
                console.log("keydown", e);
                e.stopPropagation();
            }}
            ref={ref}
        >
            <Cmd.Input onValueChange={onChange} style={{ display: "none" }} value={query} />
            <CommandEmpty>No results.</CommandEmpty>
            <CommandList className="scrollbar-thin flex max-h-48 flex-col gap-1 overflow-y-auto px-1 pt-1">
                {commands.map((command) => (
                    <CommandItem
                        className="flex justify-between"
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
    );
};
