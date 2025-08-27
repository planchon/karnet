"use client";

import { action, makeObservable } from "mobx";
import type { DiagramModel } from "@/models/diagram.model";
import type { PaperModel } from "@/models/paper.model";
import type { SketchModel } from "@/models/sketch.model";
import type { RootStore } from "@/stores/root.store";
import { AbstractView } from "./abstract.view";

type DocumentItem = PaperModel | SketchModel | DiagramModel;

export class DocumentView extends AbstractView<DocumentItem> {
	order = "createdAt";
	filters: Record<string, string> = {};
	groups: Record<string, string> = {};
	display: string[] = ["id", "name", "createdAt"];

	constructor(rootStore: RootStore) {
		super(rootStore);

		makeObservable(this, {
			displayColumns: action,
		});
	}

	get getAllItems() {
		const documents = this.rootStore.paperStore.allModels;
		const sketches = this.rootStore.sketchesStore.allModels;
		const diagrams = this.rootStore.diagramStore.allModels;

		const rawItems = [...documents, ...sketches, ...diagrams];

		return rawItems;
	}

	orderBy(items: DocumentItem[]) {
		return items;
	}

	search(items: DocumentItem[]) {
		return items.filter((item) =>
			item.name.toLowerCase().includes(this.query.toLowerCase()),
		);
	}

	filterBy(items: DocumentItem[]) {
		return items;
	}

	displayColumns() {
		return this.display;
	}

	groupBy(items: DocumentItem[]): Record<string, DocumentItem[]> {
		return {
			all: items,
		};
	}
}
