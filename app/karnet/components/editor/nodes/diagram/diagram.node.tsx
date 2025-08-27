import { MermaidDiagram } from "@lightenna/react-mermaid-diagram";
import { type Editor, mergeAttributes, Node } from "@tiptap/core";
import {
	NodeViewWrapper,
	ReactNodeViewRenderer,
	useEditorState,
} from "@tiptap/react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useStores } from "@/hooks/useStores";
import { cn, generateId } from "@/lib/utils";

const Component = observer(
	({ editor, node }: { editor: Editor; node: any }) => {
		const id = node.attrs.id;
		const nodeUniqueId = node.attrs.nodeUniqueId;
		const { diagramStore } = useStores();
		const router = useRouter();

		const isSelected = useEditorState({
			editor,
			selector: (state) => {
				const selectedContent = state.editor.state.selection
					.content()
					.content.toJSON();

				if (selectedContent && selectedContent.length == 1) {
					const node = selectedContent[0];
					return node.attrs["nodeUniqueId"] === nodeUniqueId;
				}

				return false;
			},
		});

		if (!id) {
			return null;
		}

		const selectedDiagram = diagramStore.getById(id);

		if (!selectedDiagram) {
			return null;
		}

		return (
			<NodeViewWrapper
				className={cn(
					"border-border my-4 flex h-[400px] w-full select-none overflow-hidden rounded border",
					isSelected && "border-accent-foreground",
				)}
			>
				<div
					onDoubleClick={() => {
						router.push(`/diagram/${id}`);
					}}
					className="flex h-full w-full cursor-pointer"
				>
					{selectedDiagram && (
						<div className="flex h-full w-full items-center justify-center">
							<MermaidDiagram className="w-3/4 select-none">
								{selectedDiagram.content}
							</MermaidDiagram>
						</div>
					)}
				</div>
			</NodeViewWrapper>
		);
	},
);

export const DiagramNode = Node.create({
	name: "diagram",
	group: "block",

	addAttributes() {
		return {
			id: {
				default: null,
			},
			nodeUniqueId: {
				default: null,
			},
		};
	},
	parseHTML() {
		return [
			{
				tag: "diagram",
			},
		];
	},
	renderHTML({ HTMLAttributes }) {
		return ["diagram", mergeAttributes(HTMLAttributes)];
	},
	addNodeView() {
		return ReactNodeViewRenderer(Component);
	},
});
