import { MermaidDiagram } from "@lightenna/react-mermaid-diagram";
import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useStores } from "@/hooks/useStores";
import { observer } from "mobx-react";
import { useNavigate } from "react-router";

const Component = observer((props: any) => {
  const { diagramStore } = useStores();
  const navigate = useNavigate();

  const id = props.node.attrs.id;
  if (!id) {
    return null;
  }

  const diagram = diagramStore.getById(id);

  if (!diagram) {
    return null;
  }

  return (
    <NodeViewWrapper className="border-border my-4 flex h-[400px] w-full select-none overflow-hidden rounded border">
      <div
        onDoubleClick={() => {
          navigate(`/diagram/${id}`);
        }}
        className="flex h-full w-full cursor-pointer items-center justify-center"
      >
        <MermaidDiagram className="w-3/4 select-none">
          {diagram.content}
        </MermaidDiagram>
      </div>
    </NodeViewWrapper>
  );
});

export const DiagramNode = Node.create({
  name: "diagram",
  group: "block",

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
