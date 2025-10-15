"use client";

import { MermaidDiagram } from "@lightenna/react-mermaid-diagram";
import Editor from "@monaco-editor/react";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { observer } from "mobx-react";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { registerMermaidLanguage } from "./mermaid-lang";

const DiagramHeader = observer(function DiagramHeaderInner({ diagram }: { diagram: Doc<"documents"> }) {
    return (
        <div className="flex h-10 w-full items-center justify-between border-b">
            <div className="flex h-full w-full select-none flex-row items-center justify-center gap-2 pl-4">
                <Input
                    className={cn("w-full border-none font-medium focus:border-transparent focus:ring-0!")}
                    placeholder="Drawing name"
                    value={diagram.title}
                />
            </div>
            <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
                <Button size="sm" variant="outline">
                    <IconAdjustmentsHorizontal className="size-3" />
                    <span className="text-xs">Infos</span>
                </Button>
            </div>
        </div>
    );
});

const DiagramEditor = observer(function DiagramEditorInner({ diagram }: { diagram: Doc<"documents"> }) {
    return (
        <div className="h-full w-full">
            <DiagramHeader diagram={diagram} />
            <div className="flex h-full w-full flex-row">
                <div className="h-full w-full">
                    <div className="h-[calc(100%-60px)] w-full border-r border-b">
                        <Editor
                            beforeMount={(monaco) => {
                                registerMermaidLanguage(monaco);
                            }}
                            height="100%"
                            language="mermaid"
                            onChange={(value) => {
                                diagram.data = value || "";
                            }}
                            options={{ minimap: { enabled: false } }}
                            value={diagram.data}
                            width="100%"
                        />
                    </div>
                </div>
                <div className="flex h-full w-full">
                    <MermaidDiagram className="h-full w-full p-10">{diagram.data}</MermaidDiagram>
                </div>
            </div>
        </div>
    );
});

export default DiagramEditor;
