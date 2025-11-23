"use client";

import type { FileUIPart } from "ai";
import type { ConvexReactClient } from "convex/react";
import { makeAutoObservable } from "mobx";
import type { ChatMessageBody } from "@/ai/schema/chat";
import { isImageGeneratingModel } from "@/ai/schema/model";
import { commands } from "@/ai/tools";
import type { FileWithUploadProcess } from "@/components/ui/file";
import { api } from "@/convex/_generated/api";
import type { KarnetModel } from "@/hooks/useModels";

export class ChatStore {
    dropdownOpen = false;

    modelDropdownOpen = false;
    toolDropdownOpen = false;

    defaultTextModel: KarnetModel | null = null;
    defaultImageModel: KarnetModel | null = null;

    selectedModel: KarnetModel | null = null;
    selectedTool: ChatMessageBody["tools"] = [];
    files: FileWithUploadProcess[] = [];

    client: ConvexReactClient | null = null;

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
        let action = "remove";

        // remove the tool if it is already selected
        if (this.selectedTool?.includes(mcp)) {
            this.selectedTool = this.selectedTool?.filter((t) => t !== mcp);
            action = "remove";
        } else {
            this.selectedTool?.push(mcp);
            action = "add";
        }

        // remove search
        if (action === "add" && mcp === "image") {
            this.selectedModel = this.defaultImageModel as KarnetModel;
            this.selectedTool = this.selectedTool?.filter((t) => t !== "web");
        } else if (action === "remove" && mcp === "image") {
            this.selectedModel = this.defaultTextModel as KarnetModel;
        }
    }

    shouldToolBeDisabled(tool: ChatMessageBody["tools"][number]) {
        switch (tool) {
            case "ocr":
                return !this.canUseOCR();
            case "web":
                return !this.canSearchWeb();
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
        // image generating models
        if (isImageGeneratingModel(model) && this.selectedTool.includes("image")) {
            return true;
        }

        // text generating models
        if (!(this.selectedTool.includes("image") || isImageGeneratingModel(model))) {
            return true;
        }

        return false;
    }

    // ------------------------------------------------------------
    // chat management
    // ------------------------------------------------------------

    canSearchWeb() {
        return !this.selectedModel?.architecture.output_modalities.includes("image");
    }

    canInputFiles() {
        return this.selectedModel?.architecture.input_modalities.includes("file");
    }

    canInputAudio() {
        return this.selectedModel?.architecture.input_modalities.includes("audio");
    }

    canInputVideo() {
        return this.selectedModel?.architecture.input_modalities.includes("video");
    }

    canUseOCR() {
        return this.files.find((f) => f.upload === "success") !== undefined;
    }

    // ------------------------------------------------------------
    // file management in the chat input
    // ------------------------------------------------------------

    async handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (!this.client) {
            return;
        }

        const newFiles = Object.values(e.target.files || {}).map((file) => ({
            file,
            upload: "in_progress" as const,
        }));
        this.addFiles(newFiles);
        e.target.value = "";

        // upload all the files
        for (const file of newFiles) {
            const uploadUrl = await this.client.mutation(api.functions.files.generateImageUploadUrl, {});
            const uploadResponse = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "Content-Type": file.file.type,
                },
                body: file.file,
            });
            const { storageId } = await uploadResponse.json();
            const { url } = await this.client.query(api.functions.files.getImageUrl, { id: storageId });
            if (!url) {
                console.error("error getting image url", storageId);
                continue;
            }
            this.updateFile({ ...file, upload: "success" as const, id: storageId, url });
        }
    }

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
