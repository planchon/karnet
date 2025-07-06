import { UserStore } from "./user.store";
import { SettingsStore } from "./settings.store";
import { CommandStore } from "./command.store";
import { PaperStore } from "./paper.store";
import { SketchesStore } from "./skeches.store";
import { DiagramStore } from "./diagram.store";
import { ViewStore } from "./view.store";

export class RootStore {
  // data store
  paperStore: PaperStore;
  sketchesStore: SketchesStore;
  diagramStore: DiagramStore;
  userStore: UserStore;

  // filter over the data store
  viewStore: ViewStore;

  // non persistent store
  settingsStore: SettingsStore;
  commandStore: CommandStore;

  constructor() {
    this.paperStore = new PaperStore(this);
    this.sketchesStore = new SketchesStore(this);
    this.diagramStore = new DiagramStore(this);
    this.userStore = new UserStore(this);

    this.viewStore = new ViewStore(this);

    this.settingsStore = new SettingsStore(this);
    this.commandStore = new CommandStore(this);
  }
}

export const rootStore = new RootStore();
