"use client";

import type { ViewItem } from "@/view/abstract.view";

export abstract class AbstractModel implements ViewItem {
	_id = "no_id";
	smallId = "";
	createdAt: Date = new Date();
	updatedAt: Date = new Date();
	deletedAt: Date | null = null;
	model_name: string = this.constructor.name;
	key = `p6n-models-${this.model_name}-${this._id}`;
	/** 
	 * @deprecated use title instead
	 */
	name = "";

	title = "";
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
	abstract generate_id(): string;

	// load the model from local storage
	load() {
		if (typeof window === "undefined") return;

		const serialized = localStorage.getItem(this.generate_id());
		if (!serialized) {
			console.debug("No model found in local storage", this.generate_id());
			this.save();
			return;
		}
		const parsed = JSON.parse(serialized);
		Object.assign(this, parsed);
	}

	save() {
		console.log("saving model", this.generate_id());
		localStorage.setItem(this.generate_id(), JSON.stringify(this.toJSON()));
	}
}
