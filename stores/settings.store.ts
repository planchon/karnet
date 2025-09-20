"use client";

import { makeObservable } from "mobx";
import { SettingsModel } from "@/models/settings.model";
import { AbstractStore } from "./abstract.store";
import type { RootStore } from "./root.store";
import { AnonymousUserId } from "./user.store";

// we have one setting per user
// settings id = user id
export class SettingsStore extends AbstractStore<SettingsModel> {
	// disable all the link in the app. ONLY USE SHORTCUTS
	constructor(rootStore: RootStore) {
		super(rootStore);

		this.seed();

		makeObservable(this, {});
	}

	// this store do not store ids
	getById(_id: string | undefined): SettingsModel {
		return {} as SettingsModel;
	}

	setById(_id: string, _model: SettingsModel): void {
		return;
	}

	loadInMemory(_id: string | undefined): SettingsModel {
		if (_id === undefined) {
			throw new Error("Id is undefined");
		}

		return new SettingsModel({ id: _id });
	}

	// this should always return a value
	// everybody starts as an anonymous user
	// then we get the setting model for the user from remote
	// meaning that the settings is always available
	getCurrent = (): SettingsModel => {
		return this.getById(AnonymousUserId) as SettingsModel;
	};

	seed() {
		const anonymousSettings = new SettingsModel({
			id: "anonymous",
			theme: "light",
		});
		this.setModel(AnonymousUserId, anonymousSettings);
	}

	createNewModel(_id: string): SettingsModel {
		throw new Error("Settings model is not creatable");
	}
}
