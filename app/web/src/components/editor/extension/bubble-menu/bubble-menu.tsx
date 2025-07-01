import {
  BubbleMenu,
  Editor,
  isTextSelection,
  useEditorState
} from "@tiptap/react";
import { BoldIcon } from "../../icons/bold-icon";
import { ItalicIcon } from "../../icons/italic-icon";
import { UnderlineIcon } from "../../icons/underline-icon";
import { LinkIcon } from "../../icons/link-icon";
import { Code2Icon } from "../../icons/code2-icon";
import { StrikeIcon } from "../../icons/strike-icon";
import { cn } from "@/lib/utils";
import { Button } from "@ui/button";
import { IconChevronDown } from "@tabler/icons-react";
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
import { useCallback } from "react";

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
  const shouldShow = useCallback(() => {
    const customNodes = ["tldraw", "diagram"];

    if (customNodes.some((node) => editor.isActive(node))) {
      return false;
    }

    return isTextSelected({ editor });
  }, [editor]);

  return (
    <BubbleMenu
      shouldShow={shouldShow}
      editor={editor}
      updateDelay={0}
      pluginKey="textMenu"
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
        </div>
      </div>
    </BubbleMenu>
  );
}
