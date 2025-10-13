"use client";

import type { Editor, Range } from "@tiptap/react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@ui/command";
import { Command as Cmd } from "cmdk";
import { useEffect, useRef, useState } from "react";
import { ProviderIcons } from "@/ai/models";
import { type KarnetModel, useModels } from "@/hooks/useModels";
import { capitalize } from "@/lib/utils";

export const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];

type ModelSuggestionComponentProps = {
    query: string;
    range: Range;
    editor: Editor;
    callback: (props: { model?: KarnetModel }) => void;
};

export const ModelSuggestionComponent = (props: ModelSuggestionComponentProps) => {
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const { models } = useModels();

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
                if (event.key === "Escape") {
                    console.log("escape keydown fovus");
                    props.editor.commands.focus();
                    return false;
                }

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

    const handleSelect = (model: KarnetModel) => {
        props.editor.chain().focus().deleteRange(props.range).run();
        callback({
            model,
        });
    };

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

    return (
        <Command className="min-w-[200px] border" onKeyDown={(e) => e.stopPropagation()} ref={ref}>
            <Cmd.Input onValueChange={onChange} style={{ display: "none" }} value={query} />
            <CommandEmpty>No results.</CommandEmpty>
            <CommandList className="scrollbar-thin max-h-[300px] overflow-y-auto">
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
    );
};
