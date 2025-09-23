"use client";

import type { Editor, Range } from "@tiptap/react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@ui/command";
import { Command as Cmd } from "cmdk";
import { useEffect, useRef, useState } from "react";
import { type GeneralKarnetModel, groupedByProvider, ProviderIcons } from "@/ai/models";
import { useStores } from "@/hooks/useStores";
import { capitalize } from "@/lib/utils";

export const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];

interface ModelSuggestionComponentProps {
    query: string;
    range: Range;
    editor: Editor;
    callback: (props: { model: GeneralKarnetModel }) => void;
}

export const ModelSuggestionComponent = (props: ModelSuggestionComponentProps) => {
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);

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

    const handleSelect = (model: GeneralKarnetModel) => {
        props.editor.chain().focus().deleteRange(props.range).run();
        callback({
            model,
        });
    };

    return (
        <Command className="min-w-[200px] border" onKeyDown={(e) => e.stopPropagation()} ref={ref}>
            <Cmd.Input onValueChange={onChange} style={{ display: "none" }} value={query} />
            <CommandEmpty>No results.</CommandEmpty>
            <CommandList className="scrollbar-thin max-h-[300px] overflow-y-auto">
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
    );
};
