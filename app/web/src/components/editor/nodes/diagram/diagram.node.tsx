import { MermaidDiagram } from "@lightenna/react-mermaid-diagram";
import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useStores } from "@/hooks/useStores";

const Component = (props: any) => {
  const { diagramStore } = useStores();

  const id = props.node.attrs.id;
  if (!id) {
    return null;
  }

  const diagram = diagramStore.getById(id);

  if (!diagram) {
    return null;
  }

  return (
    <NodeViewWrapper className="border-border flex h-[400px] w-full select-none flex-col items-center justify-center overflow-hidden rounded border">
      <MermaidDiagram className="w-3/4 select-none" disableJs>
        {diagram.content}
      </MermaidDiagram>
    </NodeViewWrapper>
  );
};

export const DiagramNode = Node.create({
  name: "diagram",
  group: "block",
  content: "text*",
  atom: true,
  addAttributes() {
    return {
      id: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "diagram"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["diagram", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(Component);
  }
});
