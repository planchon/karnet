import { UserStore } from "./user.store";
import { SettingsStore } from "./settings.store";
import { CommandStore } from "./command.store";

export class RootStore {
  userStore: UserStore;
  settingsStore: SettingsStore;
  commandStore: CommandStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.settingsStore = new SettingsStore(this);
    this.commandStore = new CommandStore(this);
  }
}

export const rootStore = new RootStore();
