"use client";

import { InputRule, mergeAttributes, Node } from "@tiptap/core";
import { allPossibleMatches, type Match } from "@/lib/date";
import { createOnNodeDeletePlugin, type NodeWithDeleteOptions } from "./node-delete";

type DeadlineNodeOptions = NodeWithDeleteOptions & {
    onDeadlineChange: (value: string, match: Match) => void;
};

export const DeadlineNode = Node.create<DeadlineNodeOptions>({
    name: "deadline",
    inline: true,
    group: "inline",
    selectable: false,

    addAttributes() {
        return {
            date: {
                default: "",
            },
            labelRender: {
                default: "dem",
            },
            type: {
                default: "date",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span[data-deadline]",
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        const attributes = mergeAttributes(
            // @ts-expect-error
            this.options.HTMLAttributes,
            HTMLAttributes,
            {
                level: 1,
                class: "mx-1 px-[4px] pb-[2px] py-px ml-1 bg-slate-200 rounded-xs",
            }
        );

        return ["span", attributes, node.attrs.labelRender];
    },

    renderText({ node }) {
        return ` ${node.attrs.labelRender}`;
    },

    addInputRules() {
        const rules: InputRule[] = [];

        const sortedMatches = Object.values(allPossibleMatches).sort((a, b) => b.priority - a.priority);

        for (const value of sortedMatches) {
            rules.push(
                new InputRule({
                    find: value.regex,
                    handler: ({ range, chain, match, state }) => {
                        const input = match[0];
                        let newRange = range;

                        if (input.startsWith("p")) {
                            newRange = {
                                from: range.from + 2,
                                to: range.to,
                            };
                        }

                        let deleted = false;

                        state.doc.descendants((node, pos) => {
                            if (node.type.name === this.name) {
                                deleted = true;
                                chain()
                                    .deleteRange({
                                        from: pos,
                                        to: pos + node.nodeSize,
                                    })
                                    .run();
                            }
                        });

                        if (deleted) {
                            newRange = {
                                from: range.from - 1,
                                to: range.to,
                            };
                        }

                        chain()
                            .insertContentAt(newRange, {
                                type: this.name,
                                attrs: {
                                    date: input,
                                    labelRender: input.trim(),
                                    type: value.label,
                                },
                            })
                            .run();

                        const stringMatch = input.trim();
                        this.options.onDeadlineChange(stringMatch, value);
                    },
                })
            );
        }

        return rules;
    },

    addProseMirrorPlugins() {
        return [createOnNodeDeletePlugin(this.name, this.options.onNodeDelete)];
    },
});
