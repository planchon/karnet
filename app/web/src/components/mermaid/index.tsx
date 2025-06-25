import { observer } from "mobx-react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { Input } from "@ui/input";
import { cn } from "@/lib/utils";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { useRef, useState } from "react";
import { MermaidDiagram } from "@lightenna/react-mermaid-diagram";
import { registerMermaidLanguage } from "./mermaid-lang";
import { useStores } from "@/hooks/useStores";
// @ts-ignore
import { initVimMode } from "monaco-vim";

const MermaidHeader = observer(function MermaidHeader() {
  return (
    <div className="flex h-10 w-full items-center justify-between border-b">
      <div className="flex h-full select-none flex-row items-center justify-center gap-2 pl-4">
        <Input
          className={cn(
            "w-full border-none font-medium focus:border-transparent focus:!ring-0"
          )}
          placeholder="Drawing name"
        />
        <div className="flex flex-row items-center gap-2 pl-2"></div>
      </div>
      <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
        <Button variant="outline" size="sm">
          <IconAdjustmentsHorizontal className="size-3" />
          <span className="text-xs">Infos</span>
        </Button>
      </div>
    </div>
  );
});

const MermaidEditor = observer(function MermaidEditor({ id }: { id: string }) {
  const { mermaidStore } = useStores();

  const mermaid = mermaidStore.getById(id);

  if (!mermaid) {
    return null;
  }

  return (
    <div className="h-full w-full">
      <MermaidHeader />
      <div className="flex h-full w-full flex-row">
        <div className="h-full w-full">
          <div className="h-[calc(100%-60px)] w-full border-b border-r">
            <Editor
              height="100%"
              width="100%"
              language="mermaid"
              beforeMount={(monaco) => {
                registerMermaidLanguage(monaco);
              }}
              onMount={(editor, monaco) => {
                initVimMode(editor, document.getElementById("status"));
              }}
              options={{ minimap: { enabled: false } }}
              value={mermaid.content}
              onChange={(value) => {
                mermaid.content = value || "";
              }}
            />
          </div>
          <div
            id="status"
            className="flex h-[25px] flex-row items-center justify-center gap-x-2 border-r px-2 pt-[1px] font-mono text-sm"
          />
        </div>
        <div className="flex h-full w-full">
          <MermaidDiagram className="h-full w-full p-10">
            {mermaid.content}
          </MermaidDiagram>
        </div>
      </div>
    </div>
  );
});

export default MermaidEditor;
