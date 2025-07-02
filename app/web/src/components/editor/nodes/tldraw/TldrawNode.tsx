import { mergeAttributes, Node, Editor } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditorState
} from "@tiptap/react";
import { Read } from "@draw/read";
import { useNavigate } from "react-router";
import { cn, generateId } from "@/lib/utils";

const Component = ({
  node,
  editor,
  getPos
}: {
  node: any;
  editor: Editor;
  getPos: () => number;
}) => {
  const id = node.attrs.id;
  const nodeUniqueId = node.attrs.nodeUniqueId;
  const navigate = useNavigate();

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
    }
  });

  if (!id) {
    return null;
  }

  return (
    <NodeViewWrapper
      className={cn(
        "border-border my-4 h-[400px] w-full cursor-pointer select-none overflow-hidden rounded border",
        isSelected && "border-accent-foreground"
      )}
    >
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
      },
      nodeUniqueId: {
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
