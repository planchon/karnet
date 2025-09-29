"use client";

import { InputRule, mergeAttributes, Node } from "@tiptap/core";
import dayjs, { type Dayjs } from "dayjs";
import { DAY_TO_NUMBER, theNext } from "@/lib/date";
import { createOnNodeDeletePlugin, type NodeWithDeleteOptions } from "./node-delete";

export const allPossibleMatches = {
    date: {
        regex: /(^|\s)(\d{1,2}\/\d{2})$/g,
        label: "date",
        callback: (input: string) => {
            const [day, month] = input.split("/");
            const dayInt = Number.parseInt(day, 10);
            const monthInt = Number.parseInt(month, 10);

            return dayjs()
                .month(monthInt - 1)
                .date(dayInt);
        },
        priority: 1000,
    },
    hours: {
        regex: /(^|\s)(\d{1,2}h(\d{1,2})?)$/g,
        label: "hours",
        callback: (input: string) => {
            const [hours, minutes] = input.split("h");
            const hoursInt = Number.parseInt(hours, 10);
            const minutesInt = Number.parseInt(minutes, 10);

            return dayjs().hour(hoursInt).minute(minutesInt);
        },
        priority: 2,
    },
    jours: {
        regex: /(^|\s)(\d{1,2}\s?j)$/g,
        label: "jours",
        callback: (input: string) => {
            const daysInt = Number.parseInt(input, 10);
            return dayjs().add(daysInt, "day");
        },
        priority: 2,
    },
    semaines: {
        regex: /(^|\s)(\d{1,2}\s?sem)$/g,
        label: "semaines",
        callback: (input: string) => {
            const weeksInt = Number.parseInt(input, 10);
            return dayjs().add(weeksInt, "week");
        },
        priority: 2,
    },
    mois: {
        regex: /(^|\s)(\d{1,2}\s?m)$/g,
        label: "mois",
        callback: (input: string) => {
            const monthsInt = Number.parseInt(input, 10);
            return dayjs().add(monthsInt, "month");
        },
        priority: 2,
    },
    dateHours: {
        regex: /(^|\s)(\d{1,2}\/\d{1,2}\s\d{1,2}h(\d{1,2})?)$/g,
        label: "dateHours",
        callback: () => {
            throw new Error("Not implemented");
        },
        priority: 1,
    },
    keyword: {
        regex: /(^|\s)(dem|sem|lun|mar|mer|jeu|ven|sam|dim|mon|tue|wed|thu|fri|sat|sun)$/g,
        callback: (input: string) => {
            if (input === "dem") {
                return dayjs().add(1, "day");
            }

            if (input === "sem") {
                return dayjs().add(1, "week");
            }

            return theNext(dayjs(), DAY_TO_NUMBER[input as keyof typeof DAY_TO_NUMBER]);
        },
        label: "keyword",
        priority: 5,
    },
    finSemaine: {
        regex: /(^|\s)(fin sem)$/g,
        callback: () => dayjs().endOf("week"),
        priority: 10,
    },
};

type DeadlineNodeOptions = NodeWithDeleteOptions & {
    onDeadlineChange: (value: Dayjs) => void;
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

                        const date = value.callback(input.trim());
                        this.options.onDeadlineChange(date);
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
