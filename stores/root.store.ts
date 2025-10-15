"use client";

import { FocusManager } from "@/lib/focus-manager";
import { ChatStore } from "./chat.store";
import { CommandStore } from "./command.store";
import { SettingsStore } from "./settings.store";
import { TaskStore } from "./task.store";

export class RootStore {
    // data store
    chatStore: ChatStore;
    taskStore: TaskStore;

    focusManager: FocusManager;

    // non persistent store
    settingsStore: SettingsStore;
    commandStore: CommandStore;

    constructor() {
        this.chatStore = new ChatStore();
        this.taskStore = new TaskStore();

        this.settingsStore = new SettingsStore();
        this.commandStore = new CommandStore(this);

        this.focusManager = new FocusManager();
    }
}

export const rootStore = new RootStore();
