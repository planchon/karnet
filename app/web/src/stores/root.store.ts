import { UserStore } from "./user.store";
import { SettingsStore } from "./settings.store";
import { CommandStore } from "./command.store";
import { DocumentStore } from "./document.store";
import { SketchesStore } from "./skeches.store";
import { DiagramStore } from "./diagram.store";

export class RootStore {
  userStore: UserStore;
  settingsStore: SettingsStore;
  commandStore: CommandStore;
  documentStore: DocumentStore;
  sketchesStore: SketchesStore;
  diagramStore: DiagramStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.settingsStore = new SettingsStore(this);
    this.commandStore = new CommandStore(this);
    this.documentStore = new DocumentStore(this);
    this.sketchesStore = new SketchesStore(this);
    this.diagramStore = new DiagramStore(this);
  }
}

export const rootStore = new RootStore();
