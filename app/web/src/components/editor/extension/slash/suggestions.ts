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
        }
      },
      {
        title: "Ordered List",
        searchTerms: ["ordered", "point", "numbers"],
        icon: IconListNumbers,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        }
      },
      {
        title: "Task List",
        searchTerms: ["task", "point"],
        icon: IconListCheck,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
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
          const allSketches = localStorage.getItem("p6n-all-sketches");
          if (!allSketches) return;
          const sketches = JSON.parse(allSketches);
          const id = sketches[0];
          editor.chain().focus().deleteRange(range).run();
          editor
            .chain()
            .focus()
            .setNode("tldraw", {
              id
            })
            .run();
        }
      },
      {
        title: "Diagram",
        searchTerms: ["diagram"],
        icon: IconChartDots3,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const allDiagrams = localStorage.getItem("p6n-all-diagrams");
          if (!allDiagrams) return;
          const diagrams = JSON.parse(allDiagrams);
          const id = diagrams[0];
          editor.chain().focus().deleteRange(range).run();
          editor
            .chain()
            .focus()
            .setNode("diagram", {
              id
            })
            .run();
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
        }
      },
      {
        title: "Quote",
        searchTerms: ["quote"],
        icon: IconQuote,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
          editor.chain().focus().setBlockquote().run();
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
