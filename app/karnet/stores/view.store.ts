"use client";

import { makeAutoObservable } from "mobx";
import type { RootStore } from "./root.store";

export class ViewStore {
	rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		makeAutoObservable(this);
	}
}
