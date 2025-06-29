import { MermaidDiagram } from "@lightenna/react-mermaid-diagram";
import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useStores } from "@/hooks/useStores";
import { observer } from "mobx-react";
import { useNavigate } from "react-router";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup
} from "@ui/command";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Button } from "@ui/button";
import { IconChevronDown } from "@tabler/icons-react";
import { DiagramModel } from "@/models/diagram.model";
import { useState } from "react";

const Component = observer((props: any) => {
  const id = props.node.attrs.id;
  const { diagramStore } = useStores();
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramModel | null>(
    diagramStore.getById(id)
  );

  if (!id) {
    return null;
  }

  return (
    <NodeViewWrapper className="border-border group my-4 flex h-[400px] w-full select-none overflow-hidden rounded border">
      <div
        onDoubleClick={() => {
          navigate(`/diagram/${id}`);
        }}
        className="flex h-full w-full cursor-pointer"
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
                <span>{selectedDiagram?.name || "Select a diagram"}</span>
                <IconChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search a diagram" />
                <CommandList>
                  <CommandEmpty>No diagram found</CommandEmpty>
                  <CommandGroup>
                    {diagramStore.allModels().map((diagram) => (
                      <CommandItem
                        key={diagram.id}
                        value={diagram.id}
                        onSelect={() => {
                          setSelectedDiagram(diagram);
                          setPopoverOpen(false);
                        }}
                        disabled={selectedDiagram?.id === diagram.id}
                      >
                        {diagram.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
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
