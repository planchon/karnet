"use client";

import type { ViewItem } from "@/view/abstract.view";

export abstract class AbstractModel implements ViewItem {
	id = "no_id";
	smallId = "";
	createdAt: Date = new Date();
	updatedAt: Date = new Date();
	deletedAt: Date | null = null;
	model_name: string = this.constructor.name;
	key = `p6n-models-${this.model_name}-${this.id}`;
	name = "";
	type = "abstract";

	constructor(
		props: Partial<AbstractModel> & {
			id: string;
		},
	) {
		// assign ids
		Object.assign(this, props);
	}

	abstract getSmallId(id: number): string;
	abstract toJSON(): unknown;
	abstract _id(): string;

	// load the model from local storage
	load() {
		if (typeof window === "undefined") return;

		const serialized = localStorage.getItem(this._id());
		if (!serialized) {
			console.debug("No model found in local storage", this._id());
			this.save();
			return;
		}
		const parsed = JSON.parse(serialized);
		Object.assign(this, parsed);
	}

	save() {
		console.log("saving model", this._id());
		localStorage.setItem(this._id(), JSON.stringify(this.toJSON()));
	}
}
