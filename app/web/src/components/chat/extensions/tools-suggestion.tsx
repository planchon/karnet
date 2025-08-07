import type { Editor, Range } from "@tiptap/react";
import { FaCalculator, FaInternetExplorer } from "react-icons/fa";

export const ToolsSuggestion = [
  {
    title: "Search",
    searchTerms: ["search", "web"],
    icon: FaInternetExplorer,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).run();
      alert("search");
    },
  },
  {
    title: "Calculator",
    searchTerms: ["calculator"],
    icon: FaCalculator,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).run();
      alert("calculator");
    },
  },
];