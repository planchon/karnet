import { Extension } from "@tiptap/react";

export const Shortcut = Extension.create({
  name: "shortcut",
  addKeyboardShortcuts() {
    // this is a hack to bypass the tiptap text input detection
    // and to send the event back to the window, where the command k is handled
    return {
      "Meta-k": () => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            bubbles: true,
            metaKey: true,
            key: "k",
            code: "KeyK",
            keyCode: 75,
            composed: true,
            // @ts-ignore
            bypassTextInput: true
          })
        );
        return true;
      },
      "Ctrl-k": () => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            bubbles: true,
            ctrlKey: true,
            key: "k",
            code: "KeyK",
            keyCode: 75,
            composed: true,
            // @ts-ignore
            bypassTextInput: true
          })
        );
        return true;
      }
    };
  }
});
