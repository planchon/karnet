import { Editor, Extension, Range } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { slashRenderItems } from "./slash-render";

const SlashCommand = Extension.create({
  name: "p6n-slash-command",
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        startOfLine: true,
        allowSpaces: false,
        render: slashRenderItems,
        command: ({ editor, range, props }) => {
          console.log("command selected", props);
          // props.command({ editor, range, props });
        }
      })
    ];
  }
});

export default SlashCommand;
