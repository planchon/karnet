"use client";

import { ChatStore } from "./chat.store";
import { SettingsStore } from "./settings.store";

export class RootStore {
    chatStore: ChatStore;
    settingsStore: SettingsStore;

    constructor() {
        this.chatStore = new ChatStore();
        this.settingsStore = new SettingsStore();
    }
}

export const rootStore = new RootStore();
