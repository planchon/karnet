import { Extension } from "@tiptap/core";

export const RewriteEnter = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: () => true,
      "Shift-Enter": () => this.editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.createParagraphNear(),
          () => commands.liftEmptyBlock(),
          () => commands.splitBlock(),
        ]),
    }
  }
})