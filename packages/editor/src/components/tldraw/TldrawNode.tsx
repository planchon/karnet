import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Read } from "@poltion/draw";

const Component = (props: any) => {
  const id = props.node.attrs.id;
  if (!id) {
    return null;
  }
  return (
    <NodeViewWrapper className="border-border h-[400px] w-full select-none overflow-hidden rounded border">
      <Read id={id} />
    </NodeViewWrapper>
  );
};

export const TldrawNode = Node.create({
  name: "tldraw",
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
