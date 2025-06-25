import { BubbleMenu, Editor } from "@tiptap/react";
import { ToggleGroup, ToggleGroupItem } from "@/primitive/ui/toggle-group";
import { BoldIcon } from "../../icons/bold-icon";
import { ItalicIcon } from "../../icons/italic-icon";
import { UnderlineIcon } from "../../icons/underline-icon";
import { LinkIcon } from "../../icons/link-icon";
import { Code2Icon } from "../../icons/code2-icon";
import { StrikeIcon } from "../../icons/strike-icon";
import { ImagePlusIcon } from "../../icons/image-plus-icon";

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

export function BubbleMenuComp({ editor }: { editor: Editor }) {
  const actions = actionsList.filter((action) => action.isActive(editor));

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <ToggleGroup
        type="multiple"
        variant="default"
        className="border-border bg-background rounded-lg border p-[2px] shadow-sm"
        value={actions.map((action) => action.value)}
      >
        {actionsList.map((action) => (
          <ToggleGroupItem
            key={action.value}
            aria-label={`Toggle ${action.label}`}
            value={action.value}
            onClick={() => action.onClick(editor)}
          >
            <action.icon />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </BubbleMenu>
  );
}
