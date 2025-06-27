import { UserStore } from "./user.store";
import { SettingsStore } from "./settings.store";
import { CommandStore } from "./command.store";
import { PaperStore } from "./paper.store";
import { SketchesStore } from "./skeches.store";
import { DiagramStore } from "./diagram.store";

export class RootStore {
  userStore: UserStore;
  settingsStore: SettingsStore;
  commandStore: CommandStore;
  paperStore: PaperStore;
  sketchesStore: SketchesStore;
  diagramStore: DiagramStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.settingsStore = new SettingsStore(this);
    this.commandStore = new CommandStore(this);
    this.paperStore = new PaperStore(this);
    this.sketchesStore = new SketchesStore(this);
    this.diagramStore = new DiagramStore(this);
  }
}

export const rootStore = new RootStore();
