'use client';

import { action, makeObservable, observable } from 'mobx';
import type { GeneralKarnetModel } from '@/ai/models';

export class ChatStore {
    selectedModel: GeneralKarnetModel = {
        name: 'Gemini 2.5 Flash',
        id: 'google/gemini-2.5-flash',
        provider: 'google',
    };
    selectedMCP: string | null = null;

    constructor() {
        makeObservable(this, {
            selectedModel: observable,
            selectedMCP: observable,
            setModel: action,
            setMCP: action,
        });
    }

    setModel(model: GeneralKarnetModel) {
        console.log('[ChatStore] setting model', model);
        this.selectedModel = model;
    }

    setMCP(mcp: string) {
        this.selectedMCP = mcp;
    }
}
