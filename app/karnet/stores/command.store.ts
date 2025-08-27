"use client";

import {
	type Icon123,
	IconDownload,
	IconFilePlus,
	IconTrash,
} from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import { makeAutoObservable } from "mobx";
import type { Editor } from "tldraw";
import type { RootStore } from "./root.store";

type Icon = LucideIcon | typeof Icon123;

export type Command = {
	name: string;
	shortcut?: string;
	action: () => void;
	icon?: Icon;
};

export class CommandStore {
	rootStore: RootStore;
	contextualCommands: {
		group: string;
		items: Command[];
	}[] = [];

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	resetContextualCommands() {
		this.contextualCommands = [];
	}

	setDrawCommands(editor: Editor) {
		const drawCommands: Command[] = [
			{
				name: "Save as PNG",
				icon: IconDownload,
				action: async () => {
					const shapeIds = editor.getCurrentPageShapeIds();
					if (shapeIds.size === 0) return alert("No shapes on the canvas");
					const { blob } = await editor.toImage([...shapeIds], {
						format: "png",
						background: true,
					});

					const link = document.createElement("a");
					link.href = URL.createObjectURL(blob);
					link.download = "sketch.png";
					link.click();
					URL.revokeObjectURL(link.href);
				},
			},
			{
				name: "Save as a new sketch",
				icon: IconFilePlus,
				action: () => {},
			},
			{
				name: "Clear the canvas",
				icon: IconTrash,
				action: () => {
					const shapeIds = editor.getCurrentPageShapeIds();
					if (shapeIds.size === 0) return alert("No shapes on the canvas");
					editor.deleteShapes([...shapeIds]);
				},
			},
		];

		this.contextualCommands = [
			{
				group: "Sketch commands",
				items: drawCommands,
			},
		];
	}
}
