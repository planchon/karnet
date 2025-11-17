"use client";

import { action, makeObservable, observable } from "mobx";

// we have one setting per user
// settings id = user id
export class SettingsStore {
    theme: "light" | "dark" = "light";
    disableLinks = false;
    isSettingsOpen = false;

    constructor() {
        makeObservable(this, {
            theme: observable,
            setTheme: action,
            disableLinks: observable,
            setDisableLinks: action,
            isSettingsOpen: observable,
            setIsSettingsOpen: action,
        });
    }

    setIsSettingsOpen(isSettingsOpen: boolean) {
        this.isSettingsOpen = isSettingsOpen;
    }

    setTheme(theme: "light" | "dark") {
        this.theme = theme;
    }

    setDisableLinks(disableLinks: boolean) {
        this.disableLinks = disableLinks;
    }
}
