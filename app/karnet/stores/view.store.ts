"use client";

import { makeAutoObservable } from "mobx";
import { DocumentView } from "@/view/document.view";
import { TaskView } from "@/view/task.view";
import type { RootStore } from "./root.store";

export class ViewStore {
	rootStore: RootStore;

	documentView: Record<string | "default", DocumentView>;
	taskView: Record<string | "default", TaskView>;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		this.documentView = {
			default: new DocumentView(this.rootStore),
		};

		this.taskView = {
			default: new TaskView(this.rootStore),
		};

		makeAutoObservable(this);
	}

	// get a document view by its id
	// its view may have different filters, order or display options
	getDocumentView(id = "default") {
		const existingView = this.documentView[id];

		if (!existingView) {
			throw new Error(`View with id ${id} not found`);
		}

		return existingView;
	}

	getTaskView(id = "default") {
		const existingView = this.taskView[id];

		if (!existingView) {
			throw new Error(`View with id ${id} not found`);
		}

		return existingView;
	}
}
