"use client";

import { action, makeObservable, observable } from "mobx";
import { defaultModel, type GeneralKarnetModel } from "@/ai/models";

export class ChatStore {
    selectedModel: GeneralKarnetModel = defaultModel;
    selectedMcp: string | null = null;

    constructor() {
        makeObservable(this, {
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
        this.selectedMcp = mcp;
    }
}
