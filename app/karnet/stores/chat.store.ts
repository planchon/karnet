'use client';

import { action, makeObservable, observable } from 'mobx';
import { geminiFlash, type KarnetModel } from '@/ai/models';

export class ChatStore {
    selectedModel: KarnetModel = geminiFlash;
    selectedMCP: string | null = null;

    constructor() {
        makeObservable(this, {
            selectedModel: observable,
            selectedMCP: observable,
            setModel: action,
            setMCP: action,
        });
    }

    setModel(model: KarnetModel) {
        console.log('[ChatStore] setting model', model);
        this.selectedModel = model;
    }

    setMCP(mcp: string) {
        this.selectedMCP = mcp;
    }
}
