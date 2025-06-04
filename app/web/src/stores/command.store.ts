import { makeAutoObservable } from "mobx";
import { LucideIcon } from "lucide-react";
import { Icon123, IconDownload, IconFilePlus } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import { Editor } from "tldraw";
import { RootStore } from "./root.store";

type Icon = LucideIcon | typeof Icon123;

export type Command = {
  name: string;
  shortcut?: string;
  action: () => void;
  icon?: Icon;
};

export class CommandStore {
  rootStore: RootStore;
  contextualCommands: Command[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setDrawCommands(editor: Editor) {
    const drawCommands: Command[] = [
      {
        name: "Save as PNG",
        icon: IconDownload,
        action: async () => {
          const shapeIds = editor.getCurrentPageShapeIds();
          if (shapeIds.size === 0) return alert("No shapes on the canvas");
          const { blob } = await editor.toImage([...shapeIds], {
            format: "png",
            background: true
          });

          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "sketch.png";
          link.click();
          URL.revokeObjectURL(link.href);
        }
      },
      {
        name: "Save as a new sketch",
        icon: IconFilePlus,
        action: () => {}
      },
      {
        name: "Clear the canvas",
        icon: IconTrash,
        action: () => {
          const shapeIds = editor.getCurrentPageShapeIds();
          if (shapeIds.size === 0) return alert("No shapes on the canvas");
          editor.deleteShapes([...shapeIds]);
        }
      }
    ];

    this.contextualCommands = drawCommands;
  }
}
