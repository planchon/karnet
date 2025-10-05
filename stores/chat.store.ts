"use client";

import { action, makeObservable, observable } from "mobx";
import type { KarnetModel } from "@/hooks/useModels";

export class ChatStore {
    dropdownOpen = false;

    selectedModel: KarnetModel = {
        id: "google/gemini-2.5-flash-preview-09-2025",
        name: "Google: Gemini 2.5 Flash Preview 09-2025",
        created: 1_758_820_178,
        description:
            'Gemini 2.5 Flash Preview September 2025 Checkpoint is Google\'s state-of-the-art workhorse model, specifically designed for advanced reasoning, coding, mathematics, and scientific tasks. It includes built-in "thinking" capabilities, enabling it to provide responses with greater accuracy and nuanced context handling. \n\nAdditionally, Gemini 2.5 Flash is configurable through the "max tokens for reasoning" parameter, as described in the documentation (https://openrouter.ai/docs/use-cases/reasoning-tokens#max-tokens-for-reasoning).',
        architecture: {
            input_modalities: ["image", "file", "text"],
            output_modalities: ["text"],
            tokenizer: "Gemini",
            instruct_type: null,
        },
        top_provider: {
            is_moderated: false,
            context_length: 1_048_576,
            max_completion_tokens: 65_536,
        },
        pricing: {
            prompt: 3e-7,
            completion: 0.000_002_5,
            image: 0.001_238,
            input_cache_read: 7.5e-8,
            input_cache_write: 3.833e-7,
        },
        canonical_slug: "google/gemini-2.5-flash-preview-09-2025",
        context_length: 1_048_576,
        hugging_face_id: "",
        per_request_limits: null,
        supported_parameters: [
            "include_reasoning",
            "max_tokens",
            "reasoning",
            "response_format",
            "seed",
            "stop",
            "structured_outputs",
            "temperature",
            "tool_choice",
            "tools",
            "top_p",
        ],
        default_parameters: {
            temperature: null,
            top_p: null,
            frequency_penalty: null,
        },
        provider: "google",
        active: false,
    };
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
