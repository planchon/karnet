import {
  BubbleMenu,
  Editor,
  isTextSelection,
  useEditorState
} from "@tiptap/react";
import { ToggleGroup, ToggleGroupItem } from "@/primitive/ui/toggle-group";
import { BoldIcon } from "../../icons/bold-icon";
import { ItalicIcon } from "../../icons/italic-icon";
import { UnderlineIcon } from "../../icons/underline-icon";
import { LinkIcon } from "../../icons/link-icon";
import { Code2Icon } from "../../icons/code2-icon";
import { StrikeIcon } from "../../icons/strike-icon";
import { ImagePlusIcon } from "../../icons/image-plus-icon";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent
} from "@/primitive/super-ui/select";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@ui/dropdown-menu";
import { PlusIcon } from "lucide-react";
import { Button } from "@ui/button";
import { IconChartDots3, IconChevronDown } from "@tabler/icons-react";
import { useStores } from "@/hooks/useStores";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@radix-ui/react-popover";
import { consoleLoggingIntegration } from "@sentry/react";
import { SketchModel } from "@/models/sketch.model";
import { DiagramModel } from "@/models/diagram.model";

const actionsList = [
  {
    label: "Bold",
    value: "bold",
    icon: BoldIcon,
    isActive: (editor: Editor) => editor.isActive("bold"),
    onClick: (editor: Editor) => editor.chain().focus().toggleBold().run()
  },
  {
    label: "Italic",
    value: "italic",
    icon: ItalicIcon,
    isActive: (editor: Editor) => editor.isActive("italic"),
    onClick: (editor: Editor) => editor.chain().focus().toggleItalic().run()
  },
  {
    label: "Underline",
    value: "underline",
    icon: UnderlineIcon,
    isActive: (editor: Editor) => editor.isActive("underline"),
    onClick: (editor: Editor) => editor.chain().focus().toggleUnderline().run()
  },
  {
    label: "Strike",
    value: "strike",
    icon: StrikeIcon,
    isActive: (editor: Editor) => editor.isActive("strike"),
    onClick: (editor: Editor) => editor.chain().focus().toggleStrike().run()
  },
  {
    label: "Code",
    value: "code",
    icon: Code2Icon,
    isActive: (editor: Editor) => editor.isActive("code"),
    onClick: (editor: Editor) => editor.chain().focus().toggleCode().run()
  },
  {
    label: "Link",
    value: "link",
    icon: LinkIcon,
    isActive: (editor: Editor) => editor.isActive("link"),
    onClick: (editor: Editor) =>
      editor
        .chain()
        .focus()
        .toggleLink({ href: "https://www.google.com" })
        .run()
  }
  // {
  //   label: "Image",
  //   value: "image",
  //   icon: <ImagePlusIcon />,
  //   isActive: (editor: Editor) => editor.isActive("image"),
  //   onClick: (editor: Editor) => {}
  // }
];

export const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to }
    }
  } = editor;

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);

  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false;
  }

  return true;
};

export function BubbleMenuComp({ editor }: { editor: Editor }) {
  const actions = actionsList.filter((action) => action.isActive(editor));
  const { diagramStore, sketchesStore } = useStores();

  const state = useEditorState({
    editor,
    selector: (state) => {
      const selectedContent = state.editor.state.selection
        .content()
        .content.toJSON();

      if (selectedContent && selectedContent.length == 1) {
        const node = selectedContent[0];
        if (node.type === "diagram") {
          return { diagram: true, diagramId: node.attrs["id"] };
        }
        if (node.type === "tldraw") {
          return { tldraw: true, tldrawId: node.attrs["id"] };
        }
      }

      return {};
    }
  });

  const range = useEditorState({
    editor,
    selector: (state) => {
      return state.editor.state.selection;
    }
  });

  return (
    <BubbleMenu
      shouldShow={({ editor }) => {
        return isTextSelected({ editor });
      }}
      editor={editor}
      tippyOptions={{ duration: 0 }}
    >
      <div
        className={cn(
          "border-border bg-background w-fit rounded-lg border p-1 shadow"
        )}
      >
        <div className="flex flex-row items-center justify-center overflow-hidden rounded-md">
          {actionsList.map((action) => (
            <Button
              variant="ghost"
              key={action.value}
              aria-label={`Toggle ${action.label}`}
              onClick={() => action.onClick(editor)}
              className="rounded-none"
            >
              <action.icon />
            </Button>
          ))}
          {state.diagram && (
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  role="combobox"
                  className="justify-between rounded-l-none"
                >
                  <span className="max-w-[100px] truncate">
                    {diagramStore.getById(state.diagramId)?.name}
                  </span>
                  <IconChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mt-2 rounded-md border p-0 shadow">
                <Command
                  defaultValue={diagramStore.getById(state.diagramId)?.name}
                >
                  <CommandInput placeholder="Search a diagram" />
                  <CommandList className="mb-0">
                    <CommandEmpty>No diagram found</CommandEmpty>
                    <CommandGroup>
                      {diagramStore.allModels().map((diagram) => (
                        <CommandItem
                          key={diagram.name}
                          value={diagram.name}
                          onSelect={() => {
                            editor
                              .chain()
                              .focus()
                              .deleteCurrentNode()
                              .insertContent(
                                `<diagram id="${diagram.id}"></diagram>`
                              )
                              .run();
                          }}
                        >
                          {diagram.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          {state.tldraw && (
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  role="combobox"
                  className="justify-between rounded-l-none"
                >
                  <span className="max-w-[100px] truncate">
                    {sketchesStore.getById(state.tldrawId)?.name}
                  </span>
                  <IconChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mt-2 rounded-md border p-0 shadow">
                <Command
                  defaultValue={sketchesStore.getById(state.tldrawId)?.name}
                >
                  <CommandInput placeholder="Search a sketch" />
                  <CommandList className="mb-0">
                    <CommandEmpty>No sketch found</CommandEmpty>
                    <CommandGroup>
                      {sketchesStore.allModels().map((sketch) => (
                        <CommandItem
                          key={sketch.name}
                          value={sketch.name}
                          onSelect={() => {
                            editor
                              .chain()
                              .focus()
                              .deleteCurrentNode()
                              .insertContent(
                                `<tldraw id="${sketch.id}"></tldraw>`
                              )
                              .run();
                          }}
                        >
                          {sketch.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </BubbleMenu>
  );
}
