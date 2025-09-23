"use client";

import { action, makeObservable, observable } from "mobx";
import { defaultModel, type GeneralKarnetModel } from "@/ai/models";

export class ChatStore {
    dropdownOpen = false;
    selectedModel: GeneralKarnetModel = defaultModel;
    selectedMcp: string | null = null;

    constructor() {
        makeObservable(this, {
            dropdownOpen: observable,
            selectedModel: observable,
            selectedMcp: observable,
            setModel: action,
            setMcp: action,
        });
    }

    setModel(model: GeneralKarnetModel) {
        console.log("[ChatStore] setting model", model);
        this.selectedModel = model;
    }

    setMcp(mcp: string) {
        if (mcp === this.selectedMcp) {
            this.selectedMcp = null;
        } else {
            this.selectedMcp = mcp;
        }
    }

    setDropdownOpen(open: boolean) {
        this.dropdownOpen = open;
    }
}
