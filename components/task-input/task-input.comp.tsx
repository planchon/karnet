"use client";

import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { EditorContent, Node, useEditor } from "@tiptap/react";
import { useStores } from "@/hooks/useStores";
import type { Match } from "@/lib/date";
import { DeadlineNode } from "./extensions/deadline";
import { PriorityNode } from "./extensions/priorities";

export function TaskInputComp() {
    const { taskStore } = useStores();

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            Node.create({
                name: "oneLine",
                topNode: true,
                content: "block",
            }),
            Paragraph,
            Text,
            PriorityNode.configure({
                onPriorityChange: (value: string) => {
                    taskStore.setPriority(value);
                    taskStore.setPriorityMatch(value);
                },
                onNodeDelete: () => {
                    taskStore.setPriority(undefined);
                },
            }),
            DeadlineNode.configure({
                onDeadlineChange: (value: string, match: Match) => {
                    const date = match.callback(value);
                    taskStore.setDeadline(date);
                    taskStore.setDeadlineMatch(value);
                },
                onNodeDelete: () => {
                    taskStore.setDeadline(undefined);
                },
            }),
        ],
        autofocus: "start",
        content: "",
        onUpdate: ({ editor: e }) => {
            const text = e.getText();
            taskStore.setTitle(text);
        },
    });

    return <EditorContent className="w-full" editor={editor} />;
}
