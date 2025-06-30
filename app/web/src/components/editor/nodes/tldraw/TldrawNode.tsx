import { mergeAttributes, Node, Editor } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditorState
} from "@tiptap/react";
import { Read } from "@draw/read";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Button } from "@ui/button";
import { SketchModel } from "@/models/sketch.model";
import { IconChevronDown } from "@tabler/icons-react";
import { useStores } from "@/hooks/useStores";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup
} from "@ui/command";
import { cn } from "@/lib/utils";

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
  const navigate = useNavigate();

  const isSelected = useEditorState({
    editor,
    selector: (state) => {
      const selectedContent = state.editor.state.selection
        .content()
        .content.toJSON();

      if (selectedContent && selectedContent.length == 1) {
        const node = selectedContent[0];
        if (node.type === "tldraw") {
          return node.attrs["id"] === id;
        }
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
