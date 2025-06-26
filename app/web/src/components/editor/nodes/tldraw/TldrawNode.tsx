import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Read } from "@draw/read";
import { useNavigate } from "react-router";

const Component = (props: any) => {
  const id = props.node.attrs.id;
  const navigate = useNavigate();
  if (!id) {
    return null;
  }

  return (
    <NodeViewWrapper className="border-border h-[400px] w-full select-none overflow-hidden rounded border">
      <div
        onDoubleClick={() => {
          navigate(`/sketch/${id}`);
        }}
        className="h-full w-full select-auto"
      >
        <Read id={id} />
      </div>
    </NodeViewWrapper>
  );
};

export const TldrawNode = Node.create({
  name: "tldraw",
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
        tag: "tldraw"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["tldraw", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(Component);
  }
});
