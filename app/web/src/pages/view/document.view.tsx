import { TooltipWrapper } from "@/primitive/super-ui/tooltip-wrapper";
import { useState } from "react";
import { Button } from "@/primitive/ui/button";
import {
  Icon123,
  IconBlocks,
  IconCloud,
  IconCube,
  IconFile,
  IconPlus,
  IconSubtask,
  IconAdjustmentsHorizontal,
  IconCalendar,
  IconPencil,
  IconPaint,
  IconPalette,
  IconTrash,
  IconChartDots3
} from "@tabler/icons-react";
import { useCommands, useShortcut } from "@/hooks/useShortcut";
import { observer } from "mobx-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/primitive/ui/avatar";
import { Label } from "@/primitive/super-ui/label";
import { useEffect } from "react";
import { cn, generateId } from "@/lib/utils";
import { useStores } from "@/hooks/useStores";
import { data, Link, useNavigate } from "react-router";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from "@/primitive/ui/context-menu";

type ViewItem = {
  id: string;
  smallId: string;
  name: string;
  createdAt: Date;
  type: "file" | "sketch" | "diagram";
};

export const DocumentView = observer(function DocumentView() {
  const commands = useCommands();

  useShortcut("n", () => {
    commands.toggleProject();
  });

  const [selectDocumentIndex, setSelectDocumentIndex] = useState<number>(-1);
  const [hoverMode, setHoverMode] = useState<"hover" | "keyboard">("hover");
  const navigate = useNavigate();

  const { documentStore, sketchesStore, diagramStore } = useStores();

  const documents = Object.values(documentStore._models).map((doc) => ({
    id: doc.id,
    smallId: doc.smallId,
    name: doc.name,
    createdAt: doc.createdAt,
    type: "file" as const
  }));

  const sketches = Object.values(sketchesStore._models).map((sketch) => ({
    id: sketch.id,
    smallId: sketch.smallId,
    name: sketch.name,
    createdAt: sketch.createdAt,
    type: "sketch" as const
  }));

  const diagrams = Object.values(diagramStore._models).map((diagram) => ({
    id: diagram.id,
    smallId: diagram.smallId,
    name: diagram.name,
    createdAt: diagram.createdAt,
    type: "diagram" as const
  }));

  const data: ViewItem[] = [...documents, ...sketches, ...diagrams];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setHoverMode("keyboard");
      if (e.key === "ArrowUp") {
        if (selectDocumentIndex === -1) {
          setSelectDocumentIndex(data.length - 1);
        } else {
          setSelectDocumentIndex((prev) => prev - 1);
        }
      }
      if (e.key === "ArrowDown") {
        setSelectDocumentIndex((prev) => prev + 1);
      }
      if (e.key === "Escape") {
        setSelectDocumentIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div className="flex h-10 w-full items-center justify-between border-b">
        <div className="flex h-full select-none flex-row items-center justify-center gap-2 pl-4">
          <span className="text-sm font-medium">Documents</span>
          <div className="flex flex-row items-center gap-2 pl-2">
            <TooltipWrapper
              tooltip={{
                title: "All projects",
                side: "bottom",
                shortcut: ["1"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconCloud className="size-3" />
                <span className="text-xs">All projects</span>
              </Button>
            </TooltipWrapper>
            <TooltipWrapper
              tooltip={{
                title: "Brume filter",
                side: "bottom",
                shortcut: ["2"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconCube className="size-3" />
                <span className="text-xs">Brume</span>
              </Button>
            </TooltipWrapper>
            <TooltipWrapper
              tooltip={{
                title: "Stratumn filter",
                side: "bottom",
                shortcut: ["3"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconBlocks className="size-3" />
                <span className="text-xs">Stratumn</span>
              </Button>
            </TooltipWrapper>
          </div>
        </div>
        <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
          {/* <TooltipWrapper
            tooltip={{
              title: "Create a project",
              side: "left",
              shortcut: ["n"]
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => commands.toggleProject()}
            >
              <IconPlus className="size-3" />
              <span className="text-xs">New project</span>
            </Button>
          </TooltipWrapper> */}
          <Button variant="outline" size="sm">
            <IconAdjustmentsHorizontal className="size-3" />
            <span className="text-xs">Display</span>
          </Button>
        </div>
      </div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="scrollbar-thin h-full w-full overflow-y-auto">
            <ContextMenu>
              <ContextMenuTrigger
                className="flex w-full flex-col"
                onMouseEnter={() => setHoverMode("hover")}
              >
                {data.map((item, index) => (
                  <DocumentRow
                    key={index}
                    item={item}
                    isSelected={
                      hoverMode === "keyboard"
                        ? Math.abs(selectDocumentIndex % data.length) === index
                        : false
                    }
                  />
                ))}
              </ContextMenuTrigger>
              <ContextMenuContent className="w-56">
                <ContextMenuItem>
                  <IconTrash className="size-4 text-red-600" />
                  <span className="text-xs text-red-600">Delete</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56 overflow-hidden">
          <ContextMenuSub>
            <ContextMenuSubTrigger className="flex flex-row items-center gap-2">
              <IconPlus className="size-4" />
              <span className="text-xs">Create</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              <ContextMenuItem
                onClick={() => {
                  const id = generateId();
                  const document = documentStore.createNewModel(id);
                  navigate(`/document/${document.id}`);
                }}
              >
                <IconFile className="size-4" />
                <span className="text-xs">File</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  const id = generateId();
                  const sketch = sketchesStore.createNewModel(id);
                  navigate(`/sketch/${sketch.id}`);
                }}
              >
                <IconPencil className="size-4" />
                <span className="text-xs">Sketch</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  const id = generateId();
                  const diagram = diagramStore.createNewModel(id);
                  navigate(`/diagram/${diagram.id}`);
                }}
              >
                <IconChartDots3 className="size-4" />
                <span className="text-xs">Diagram</span>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
});

const DocumentRow = observer(function DocumentRow({
  isSelected,
  item
}: {
  isSelected: boolean;
  item: ViewItem;
}) {
  const navigate = useNavigate();

  return (
    <Link
      className={cn(
        "hover:bg-accent/50 flex h-10 w-full cursor-pointer select-none items-center justify-between px-5 py-2",
        isSelected && "bg-accent/50"
      )}
      to={`/${item.type}/${item.id}`}
    >
      <div className="flex flex-row gap-3">
        <div className="w-5">
          {item.type === "file" ? (
            <IconFile className="text-accent-foreground/80 size-4" />
          ) : item.type === "sketch" ? (
            <IconPalette className="text-accent-foreground/80 size-4" />
          ) : (
            <IconChartDots3 className="text-accent-foreground/80 size-4" />
          )}
        </div>
        <div className="text-accent-foreground/80 w-12 text-sm font-normal">
          {item.smallId}
        </div>
        <div className="text-accent-foreground text-sm font-medium">
          {item.name}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label label="test" icon={IconCalendar} className="bg-background" />
        <div className="text-accent-foreground/70 text-[12px]">Mer 24.06</div>
        <div>
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Link>
  );
});
