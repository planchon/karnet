import { mergeAttributes, Node, Editor } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
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
  const { sketchesStore } = useStores();
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedSketch, setSelectedSketch] = useState<SketchModel | null>(
    sketchesStore.getById(id)
  );

  const handleSelectSketch = (sketch: SketchModel) => {
    setSelectedSketch(sketch);
    setPopoverOpen(false);
    const view = editor.view;
    view.dispatch(
      view.state.tr.setNodeMarkup(getPos(), undefined, {
        id: sketch.id
      })
    );
  };

  if (!id) {
    return null;
  }

  return (
    <NodeViewWrapper className="border-border group my-4 h-[400px] w-full cursor-pointer select-none overflow-hidden rounded border">
      <div
        onDoubleClick={() => {
          navigate(`/sketch/${id}`);
        }}
        className="h-full w-full select-auto"
      >
        <div
          className={cn(
            "absolute z-[1000] hidden p-2 group-hover:block",
            popoverOpen && "block"
          )}
        >
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={popoverOpen}
                className="w-[150px] justify-between"
              >
                <span>{selectedSketch?.name || "Select a sketch"}</span>
                <IconChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search a sketch" />
                <CommandList>
                  <CommandEmpty>No sketch found</CommandEmpty>
                  <CommandGroup>
                    {sketchesStore.allModels().map((sketch) => (
                      <CommandItem
                        key={sketch.id}
                        value={sketch.id}
                        onSelect={() => {
                          handleSelectSketch(sketch);
                        }}
                        disabled={selectedSketch?.id === sketch.id}
                      >
                        {sketch.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {selectedSketch && <Read id={selectedSketch.id} />}
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
