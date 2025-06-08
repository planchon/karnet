import { Editor, Range } from "@tiptap/react";

export const slashItems = (query: string) => {
  console.log(query);
  return [
    {
      title: "Heading 1",
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      }
    }
  ];
};
