import { Editor, Extension, Range } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";

const SlashCommand = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          console.log(editor, range);
          props.command({ editor, range });
        }
      }
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestions
      })
    ];
  }
}).configure({
  suggestion: {
    items: () => [],
    render: () => null
  }
});

export default SlashCommand;
