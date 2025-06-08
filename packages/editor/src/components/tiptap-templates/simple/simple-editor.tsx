import * as React from "react";
import {
  BubbleMenu,
  EditorContent,
  EditorContext,
  useEditor,
  Editor
} from "@tiptap/react";

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

// --- Custom Extensions ---
import { Link } from "../../../components/tiptap-extension/link-extension";
import { Selection } from "../../../components/tiptap-extension/selection-extension";
import { TrailingNode } from "../../../components/tiptap-extension/trailing-node-extension";

// --- UI Primitives ---
import { Button } from "../../../components/tiptap-ui-primitive/button";
import { Spacer } from "../../../components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator
} from "../../../components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "../../../components/tiptap-node/image-upload-node/image-upload-node-extension";
import "../../../components/tiptap-node/code-block-node/code-block-node.scss";
import "../../../components/tiptap-node/list-node/list-node.scss";
import "../../../components/tiptap-node/image-node/image-node.scss";
import "../../../components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "../../../components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "../../../components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "../../../components/tiptap-ui/list-dropdown-menu";
import { BlockQuoteButton } from "../../../components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "../../../components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton
} from "../../../components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton
} from "../../../components/tiptap-ui/link-popover";
import { MarkButton } from "../../../components/tiptap-ui/mark-button";
import { TextAlignButton } from "../../../components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "../../../components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "../../../components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "../../../components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "../../../components/tiptap-icons/link-icon";

// --- Hooks ---
import { useMobile } from "../../../hooks/use-mobile";
import { useWindowSize } from "../../../hooks/use-window-size";
import { useCursorVisibility } from "../../../hooks/use-cursor-visibility";

// --- Components ---
import { ThemeToggle } from "../../../components/tiptap-templates/simple/theme-toggle";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "../../../lib/tiptap-utils";

// --- Styles ---
import "../../../components/tiptap-templates/simple/simple-editor.scss";

import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { BubbleMenuComp } from "../../bubble-menu/bubble-menu";
import {
  enableKeyboardNavigation,
  Slash,
  SlashCmd,
  SlashCmdProvider
} from "@poltion/slash-tiptap";

import { allSuggestions } from "../../slash/suggestions";

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <BlockQuoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <Spacer />
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

type Props = {
  id: string;
};

let doc = new Y.Doc();

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
      Slash.configure({
        suggestion: {
          // items: () =>
          //   allSuggestions
          //     .flatMap((item) => item.items)
          //     .map((item) => ({
          //       title: item.title,
          //       searchTerms: item.searchTerms,
          //       icon: item.icon,
          //       command: item.command
          //     }))
        }
      }),
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
      })
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

    const key = `p6n-writer-${id}`;
    const data = localStorage.getItem(key);
    if (data) {
      editor.commands.setContent(JSON.parse(data));
    } else {
      editor.commands.setContent("<p>Hello</p>");
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

  if (!editor) return null;

  return (
    <EditorContext.Provider value={{ editor }}>
      <SlashCmdProvider>
        <Toolbar
          ref={toolbarRef}
          style={
            isMobile
              ? {
                  bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`
                }
              : {}
          }
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <div className="content-wrapper">
          <BubbleMenuComp editor={editor} />
          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content"
          />
          <SlashCmd.Root editor={editor}>
            <SlashCmd.Cmd
              className="bg-background z-50 h-auto w-[200px] rounded-md border transition-all"
              loop
            >
              <SlashCmd.Empty>No commands available</SlashCmd.Empty>
              <SlashCmd.List>
                {allSuggestions.map((group, groupIndex) => (
                  <>
                    <div className="p-1" key={group.group}>
                      {group.items.map((item) => (
                        <SlashCmd.Item
                          value={item.title}
                          onCommand={(val) => {
                            item.command(val);
                          }}
                          className="aria-selected:bg-sidebar-accent flex w-full cursor-pointer items-center space-x-2 rounded-sm p-2 text-left text-sm"
                          key={item.title}
                        >
                          <div className="flex items-center space-x-2">
                            <item.icon className="h-4 w-4" />
                            <p className="text-sm font-medium">{item.title}</p>
                          </div>
                        </SlashCmd.Item>
                      ))}
                    </div>
                    <div>
                      {groupIndex < allSuggestions.length - 1 && (
                        <SlashCmd.Separator className="bg-border h-[1px] w-full" />
                      )}
                    </div>
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
