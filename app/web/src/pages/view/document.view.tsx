import { TooltipWrapper } from "@/primitive/super-ui/tooltip-wrapper";
import { Key, useRef, useState } from "react";
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
import { useSettings, useStores } from "@/hooks/useStores";
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
  type: "paper" | "sketch" | "diagram";
};

type NavigationMode = "keyboard" | "mouse";

const UP_KEYS = ["ArrowUp", "ArrowLeft", "k"] as const satisfies Key[];
const DOWN_KEYS = ["ArrowDown", "ArrowRight", "j"] as const satisfies Key[];

export const DocumentView = observer(function DocumentView() {
  const { paperStore, sketchesStore, diagramStore } = useStores();
  const commands = useCommands();
  const settings = useSettings();
  const navigate = useNavigate();

  useShortcut("n", () => {
    commands.toggleProject();
  });

  const lastHoveredElement = useRef<HTMLElement | null>(null);
  const [navigationMode, setNavigationMode] =
    useState<NavigationMode>("keyboard");
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<number>(0);
  const documentViewRef = useRef<HTMLDivElement>(null);

  const documents = Object.values(paperStore._models).map((doc) => ({
    id: doc.id,
    smallId: doc.smallId,
    name: doc.name,
    createdAt: doc.createdAt,
    type: "paper" as const
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

  console.log("data", data.length);

  const updateDocumentIndex = (index: number) => {
    setSelectedDocumentIndex(index);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    setNavigationMode("keyboard");
    const lastIndexFromHover =
      lastHoveredElement.current?.getAttribute("data-list-index");
    lastHoveredElement.current = null;

    let lastIndex = selectedDocumentIndex;

    // the mouse when hovering something
    if (lastIndexFromHover) {
      lastIndex = parseInt(lastIndexFromHover);
    }

    if (UP_KEYS.includes(e.key as any)) {
      let newValue = lastIndex - 1;

      if (newValue < 0) {
        newValue = data.length - 1;
      }

      updateDocumentIndex(newValue);
    }

    if (DOWN_KEYS.includes(e.key as any)) {
      let newValue = lastIndex + 1;

      if (newValue >= data.length) {
        newValue = 0;
      }

      updateDocumentIndex(newValue);
    }

    if (e.key === "Enter") {
      const document = data[selectedDocumentIndex];
      if (document) {
        navigate(`/${document.type}/${document.id}`);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setNavigationMode("mouse");
      lastHoveredElement.current = e.target as HTMLElement;
    };

    documentViewRef.current?.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      documentViewRef.current?.removeEventListener(
        "keydown",
        handleKeyDown,
        true
      );
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [selectedDocumentIndex]);

  useEffect(() => {
    documentViewRef.current?.focus();
  }, []);

  return (
    <div
      className="h-full w-full focus:outline-none"
      ref={documentViewRef}
      tabIndex={1}
    >
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
              <ContextMenuTrigger className="flex w-full flex-col">
                {data.map((item, index) => (
                  <DocumentRow
                    className={cn(
                      selectedDocumentIndex === index &&
                        (navigationMode === "keyboard" || settings.disableLinks)
                        ? "bg-accent/50"
                        : "",
                      navigationMode === "mouse" &&
                        "hover:bg-accent/50 cursor-pointer"
                    )}
                    key={item.id}
                    listIndex={index}
                    item={item}
                    // isSelected={hoverMode === "keyboard"}
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
                  const document = paperStore.createModel(id);
                  navigate(`/paper/${document.id}`);
                }}
              >
                <IconFile className="size-4" />
                <span className="text-xs">File</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  const id = generateId();
                  const sketch = sketchesStore.createModel(id);
                  navigate(`/sketch/${sketch.id}`);
                }}
              >
                <IconPencil className="size-4" />
                <span className="text-xs">Sketch</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  const id = generateId();
                  const diagram = diagramStore.createModel(id);
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
  className,
  item,
  listIndex
}: {
  className?: string;
  item: ViewItem;
  listIndex: number;
}) {
  const settings = useSettings();
  return (
    <Link
      className={cn(
        "flex h-10 w-full select-none items-center justify-between px-5 py-2",
        className,
        settings.disableLinks && "pointer-events-none select-none"
      )}
      to={`/${item.type}/${item.id}`}
      key={item.id}
      data-document-id={item.id}
      data-list-index={listIndex}
    >
      <div className="flex flex-row gap-3">
        <div className="w-5">
          {item.type === "paper" ? (
            <IconFile className="text-accent-foreground/80 size-4" />
          ) : item.type === "sketch" ? (
            <IconPalette className="text-accent-foreground/80 size-4" />
          ) : (
            <IconChartDots3 className="text-accent-foreground/80 size-4" />
          )}
        </div>
        <div className="text-accent-foreground/80 w-16 text-sm font-normal">
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
