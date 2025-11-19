"use client";

import type { FileUIPart } from "ai";
import { makeAutoObservable } from "mobx";
import type { ChatMessageBody } from "@/ai/schema/chat";
import { isImageGeneratingModel } from "@/ai/schema/model";
import { commands } from "@/ai/tools";
import type { FileWithUploadProcess } from "@/components/ui/file";
import type { KarnetModel } from "@/hooks/useModels";

export class ChatStore {
    dropdownOpen = false;

    modelDropdownOpen = false;
    toolDropdownOpen = false;

    selectedModel: KarnetModel | null = null;
    selectedTool: ChatMessageBody["tools"] = [];
    files: FileWithUploadProcess[] = [];

    availableTools: (ChatMessageBody["tools"][number] & {
        selected: boolean;
        disabled: boolean;
    })[] = [];

    availableModels: KarnetModel[] = [];

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setModel(model: KarnetModel) {
        if (!isImageGeneratingModel(model) && this.selectedTool.includes("image")) {
            this.selectedTool = this.selectedTool.filter((t) => t !== "image");
        }

        if (isImageGeneratingModel(model)) {
            this.selectedTool = this.selectedTool.filter((t) => t !== "web");
        }

        this.selectedModel = model;

        if (isImageGeneratingModel(model)) {
            this.selectedTool.push("image");
        }
    }

    toggleTool(mcp: ChatMessageBody["tools"][number]) {
        if (mcp === "image" && (!isImageGeneratingModel(this.selectedModel) || this.selectedTool.includes("image"))) {
            this.selectedModel = null;
        }

        if (this.selectedTool?.includes(mcp)) {
            this.selectedTool = this.selectedTool?.filter((t) => t !== mcp);
        } else {
            this.selectedTool?.push(mcp);
        }
    }

    shouldToolBeDisabled(tool: ChatMessageBody["tools"][number]) {
        switch (tool) {
            case "ocr":
                return this.files.length === 0;
            case "web":
                // we use vision models to generate images
                return isImageGeneratingModel(this.selectedModel);
            default:
                return false;
        }
    }

    getAvailableTools() {
        return commands.map((command) => ({
            ...command,
            selected: this.selectedTool?.includes(command.id),
            disabled: this.shouldToolBeDisabled(command.id),
        }));
    }

    resetTools() {
        this.selectedTool = [];
    }

    setDropdownOpen(open: boolean) {
        this.dropdownOpen = open;
    }

    setModelDropdownOpen(open: boolean) {
        this.modelDropdownOpen = open;
    }

    setToolDropdownOpen(open: boolean) {
        this.toolDropdownOpen = open;
    }

    canUseModel(model: KarnetModel) {
        if (isImageGeneratingModel(model) && this.selectedTool.includes("image")) {
            return true;
        }

        if (!(isImageGeneratingModel(model) || this.selectedTool.includes("image"))) {
            return true;
        }

        return false;
    }

    // ------------------------------------------------------------
    // file management in the chat input
    // ------------------------------------------------------------

    addFiles(file: FileWithUploadProcess[]) {
        this.files.push(...file);
    }

    removeFile(file: FileWithUploadProcess) {
        this.files = this.files.filter((f) => f.file.name !== file.file.name);
    }

    updateFile(file: FileWithUploadProcess) {
        this.files = this.files.map((f) => (f.file.name === file.file.name ? file : f));
    }

    resetFiles() {
        this.files = [];
    }

    allFilesAreUploaded() {
        if (this.files.length === 0) {
            return true;
        }
        return this.files.every((f) => f.upload === "success");
    }

    getFiles() {
        return this.files;
    }

    getFilesForChat(): FileUIPart[] | undefined {
        if (this.files.length === 0) {
            return;
        }

        // all files should be uploaded before we call this function
        return this.files
            .filter((f) => f.upload === "success")
            .map((f) => ({
                type: "file",
                url: f.url,
                mediaType: f.file.type,
                filename: f.file.name,
                providerMetadata: {
                    karnet: {
                        file_id: f.id,
                    },
                },
            }));
    }
}
