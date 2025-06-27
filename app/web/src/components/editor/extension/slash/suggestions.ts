import { rootStore } from "@/stores/root.store";
import {
  IconChartDots3,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconListCheck,
  IconListNumbers,
  IconPencil,
  IconPhoto,
  IconQuote,
  IconTable
} from "@tabler/icons-react";
import { type Editor, type Range } from "@tiptap/react";
import posthog from "posthog-js";
import { toast } from "sonner";

export const allSuggestions = [
  {
    group: "headings",
    items: [
      {
        title: "Heading 1",
        searchTerms: ["h1"],
        icon: IconH1,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleHeading({ level: 1 })
            .run();
          posthog.capture("file_create_heading", {
            level: 1
          });
        }
      },
      {
        title: "Heading 2",
        searchTerms: ["h2"],
        icon: IconH2,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleHeading({ level: 2 })
            .run();
          posthog.capture("file_create_heading", {
            level: 2
          });
        }
      },
      {
        title: "Heading 3",
        searchTerms: ["h3"],
        icon: IconH3,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleHeading({ level: 3 })
            .run();
          posthog.capture("file_create_heading", {
            level: 3
          });
        }
      }
    ]
  },
  {
    group: "lists",
    items: [
      {
        title: "Bullet List",
        searchTerms: ["unordered", "point"],
        icon: IconListCheck,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
          posthog.capture("file_create_bullet_list");
        }
      },
      {
        title: "Ordered List",
        searchTerms: ["ordered", "point", "numbers"],
        icon: IconListNumbers,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
          posthog.capture("file_create_ordered_list");
        }
      },
      {
        title: "Task List",
        searchTerms: ["task", "point"],
        icon: IconListCheck,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
          posthog.capture("file_create_task_list");
        }
      }
    ]
  },
  {
    group: "media",
    items: [
      {
        title: "Image",
        searchTerms: ["image"],
        icon: IconPhoto,
        disabled: true,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {}
      },
      {
        title: "Sketch",
        searchTerms: ["sketch"],
        icon: IconPencil,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const id = Object.values(rootStore.sketchesStore._models)[0]?.id;
          if (!id) {
            console.debug("No sketch found");
            return;
          }
          editor.chain().focus().deleteRange(range).run();
          editor
            .chain()
            .focus()
            .insertContent(`<tldraw id="${id}"></tldraw>`)
            .run();
          posthog.capture("file_create_sketch");
        }
      },
      {
        title: "Diagram",
        searchTerms: ["diagram"],
        icon: IconChartDots3,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const id = Object.values(rootStore.diagramStore._models)[0]?.id;
          if (!id) {
            console.debug("No diagram found");
            return;
          }
          editor.chain().focus().deleteRange(range).run();
          editor
            .chain()
            .focus()
            .insertContent(`<diagram id="${id}"></diagram>`)
            .run();
          posthog.capture("file_create_diagram");
        }
      }
    ]
  },
  {
    group: "others",
    items: [
      {
        title: "Code",
        searchTerms: ["code"],
        icon: IconCode,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
          editor.chain().focus().setCodeBlock().run();
          posthog.capture("file_create_code_block");
        }
      },
      {
        title: "Quote",
        searchTerms: ["quote"],
        icon: IconQuote,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
          editor.chain().focus().setBlockquote().run();
          posthog.capture("file_create_blockquote");
        }
      },
      {
        title: "Table",
        searchTerms: ["table"],
        icon: IconTable,
        disabled: true,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {}
      }
    ]
  }
];
