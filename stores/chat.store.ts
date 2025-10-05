"use client";

import { action, makeObservable, observable } from "mobx";
import type { KarnetModel } from "@/hooks/useModels";

export class ChatStore {
    dropdownOpen = false;

    selectedModel: KarnetModel | null = null;
    selectedMcp: string | null = null;

    availableModels: KarnetModel[] = [];

    constructor() {
        makeObservable(this, {
            dropdownOpen: observable,
            selectedModel: observable,
            selectedMcp: observable,
            setModel: action,
            setMcp: action,
            resetMcp: action,
        });
    }

    setModel(model: KarnetModel) {
        this.selectedModel = model;
    }

    setMcp(mcp: string) {
        if (mcp === this.selectedMcp) {
            this.selectedMcp = null;
        } else {
            this.selectedMcp = mcp;
        }
    }

    resetMcp() {
        this.selectedMcp = null;
    }

    setDropdownOpen(open: boolean) {
        this.dropdownOpen = open;
    }
}
