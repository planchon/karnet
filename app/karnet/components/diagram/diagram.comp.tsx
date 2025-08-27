import { MermaidDiagram } from "@lightenna/react-mermaid-diagram";
import Editor from "@monaco-editor/react";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { observer } from "mobx-react";
// @ts-ignore
import { initVimMode } from "monaco-vim";
import { useStores } from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import type { DiagramModel } from "@/models/diagram.model";
import { registerMermaidLanguage } from "./mermaid-lang";

const DiagramHeader = observer(function DiagramHeader({
	diagram,
}: {
	diagram: DiagramModel;
}) {
	return (
		<div className="flex h-10 w-full items-center justify-between border-b">
			<div className="flex h-full w-full select-none flex-row items-center justify-center gap-2 pl-4">
				<Input
					className={cn(
						"w-full border-none font-medium focus:border-transparent focus:ring-0!",
					)}
					placeholder="Drawing name"
					value={diagram.name}
					onChange={(e) => {
						diagram.setName(e.target.value);
					}}
				/>
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

const DiagramEditor = observer(function DiagramEditor({
	diagram,
}: {
	diagram: DiagramModel;
}) {
	return (
		<div className="h-full w-full">
			<DiagramHeader diagram={diagram} />
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
							value={diagram.content}
							onChange={(value) => {
								diagram.content = value || "";
							}}
						/>
					</div>
					<div
						id="status"
						className="flex h-[25px] flex-row items-center justify-center gap-x-2 border-r px-2 pt-px font-mono text-sm"
					/>
				</div>
				<div className="flex h-full w-full">
					<MermaidDiagram className="h-full w-full p-10">
						{diagram.content}
					</MermaidDiagram>
				</div>
			</div>
		</div>
	);
});

export default DiagramEditor;
