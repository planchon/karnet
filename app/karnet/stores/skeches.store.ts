"use client";

import { z } from "zod";
import { SketchModel } from "@/models/sketch.model";
import { AbstractStore } from "./abstract.store";
import type { RootStore } from "./root.store";

const ALL_SKETCHES_KEY = "p6n-all-sketches";

const sketchArraySchema = z.array(z.string());

export class SketchesStore extends AbstractStore<SketchModel> {
	store_key = ALL_SKETCHES_KEY;
	store_name = "sketch";
	smallId = "SKCH";

	constructor(rootStore: RootStore) {
		super(rootStore);
		this.rootStore = rootStore;
	}

	loadInMemory(id: string | undefined): SketchModel {
		if (id === undefined) throw new Error("Id is undefined");
		const sketch = new SketchModel({ id });
		console.log("load in memory sketch", sketch);
		return sketch;
	}

	createNewModel(id: string): SketchModel {
		const sketch = new SketchModel({ id });
		sketch.smallId = `SKT-${this.getLength() + 1}`;
		sketch.save();
		this.setModel(id, sketch);
		this.save();
		return sketch;
	}
}
