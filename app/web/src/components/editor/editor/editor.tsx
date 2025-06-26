import * as React from "react";
import { EditorContent, EditorContext, useEditor, Editor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";

// --- Custom Extensions ---
import { Link } from "../extension/link/link-extension";
import { Selection } from "../extension/select/selection-extension";
import { TrailingNode } from "../extension/trailing/trailing-node-extension";

// --- Tiptap Node ---
import { ImageUploadNode } from "@editor/nodes/image-upload-node/image-upload-node-extension";

import "@editor/nodes/code-block-node/code-block-node.scss";
import "@editor/nodes/list-node/list-node.scss";
import "@editor/nodes/image-node/image-node.scss";
import "@editor/nodes/paragraph-node/paragraph-node.scss";

// --- Hooks ---
import { useMobile } from "@editor/hooks/use-mobile";
import { useWindowSize } from "@editor/hooks/use-window-size";
import { useCursorVisibility } from "@editor/hooks/use-cursor-visibility";

// --- Lib ---
import {
  cn,
  handleImageUpload,
  MAX_FILE_SIZE
} from "@editor/utils/tiptap-utils";

// --- Styles ---
import "./editor.scss";

import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { BubbleMenuComp } from "../extension/bubble-menu/bubble-menu";
import {
  enableKeyboardNavigation,
  Slash,
  SlashCmd,
  SlashCmdProvider
} from "@poltion/slash-tiptap";

import { allSuggestions } from "@editor/extension/slash/suggestions";
import { Shortcut } from "@editor/extension/shortcut/shortcut";
import { TldrawNode } from "@editor/nodes/tldraw/TldrawNode";
import { DiagramNode } from "@editor/nodes/diagram/diagram.node";

type Props = {
  id: string;
};

let doc = new Y.Doc();

const suggestions = allSuggestions.flatMap((group) => group.items);

export function SimpleEditor({ id }: Props) {
  const isMobile = useMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const editor: Editor | null = useEditor({
    immediatelyRender: false,
    autofocus: "start",
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text."
      },
      handleDOMEvents: {
        keydown: (_, v) => {
          return enableKeyboardNavigation(v);
        }
      }
    },
    extensions: [
      // @ts-ignore
      Slash.configure({
        suggestion: {
          // @ts-ignore
          items: () => suggestions
        }
      }),
      Shortcut,
      StarterKit.configure({
        history: false
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,

      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error)
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
      Collaboration.configure({
        document: doc
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Heading";
          }
          if (node.type.name === "paragraph") {
            return "Write something (or / to open commands)...";
          }
          return "";
        }
      }),
      TldrawNode,
      DiagramNode
    ]
  });

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  React.useEffect(() => {
    if (!id || !editor) return;

    const key = `p6n-file-${id}`;
    const data = localStorage.getItem(key);
    if (data) {
      editor.commands.setContent(JSON.parse(data));
    } else {
      editor.commands.setContent("");
    }

    editor.on("update", () => {
      // throttle
      const timeout = setTimeout(() => {
        const data = editor.getJSON();
        localStorage.setItem(key, JSON.stringify(data));
      }, 100);

      return () => clearTimeout(timeout);
    });

    return () => {
      editor.off("update");
    };
  }, [id, editor]);

  React.useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!editor) return;
        editor.commands.blur();
      }
    });
  }, [editor]);

  if (!editor) return null;

  return (
    <EditorContext.Provider value={{ editor }}>
      <SlashCmdProvider>
        <div className="content-wrapper">
          <BubbleMenuComp editor={editor} />
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content"
          />
          {/* @ts-ignore */}
          <SlashCmd.Root editor={editor}>
            <SlashCmd.Cmd
              className="bg-background z-50 h-auto w-[200px] rounded-md border transition-all"
              loop
            >
              <SlashCmd.Empty>No commands available</SlashCmd.Empty>
              <SlashCmd.List>
                {allSuggestions.map((group, groupIndex) => (
                  <>
                    <SlashCmd.Group className="p-1">
                      {group.items.map((item) => (
                        <SlashCmd.Item
                          value={item.title}
                          onCommand={(val) => {
                            // @ts-ignore
                            item.command(val);
                          }}
                          disabled={item.disabled}
                          className={cn(
                            "aria-selected:bg-sidebar-accent flex w-full cursor-pointer items-center space-x-2 rounded-sm p-2 text-left text-sm",
                            item.disabled && "opacity-50"
                          )}
                          key={item.title}
                        >
                          <div className="flex items-center space-x-2">
                            <item.icon className="h-4 w-4" />
                            <p className="text-sm font-medium">{item.title}</p>
                          </div>
                        </SlashCmd.Item>
                      ))}
                    </SlashCmd.Group>
                    <SlashCmd.Group>
                      {groupIndex < allSuggestions.length - 1 &&
                        group.items.length > 0 && (
                          <SlashCmd.Separator className="bg-border h-[1px] w-full" />
                        )}
                    </SlashCmd.Group>
                  </>
                ))}
              </SlashCmd.List>
            </SlashCmd.Cmd>
          </SlashCmd.Root>
        </div>
      </SlashCmdProvider>
    </EditorContext.Provider>
  );
}
