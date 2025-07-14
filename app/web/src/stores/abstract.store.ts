import { IsObject, IsString } from "class-validator";
import { action, computed, makeObservable, observable } from "mobx";
import posthog from "posthog-js";
import z from "zod";
import type { AbstractModel } from "@/models/abstract.model";
import type { RootStore } from "./root.store";

export abstract class AbstractStore<T extends AbstractModel> {
	rootStore: RootStore;

	@IsObject()
	private _models: Map<string, T> = new Map();

	@IsString()
	store_name: string = "abstract";

	@IsString()
	store_key: string = `p6n-stores-${this.store_name}`;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		makeObservable<AbstractStore<T>, "_models">(this, {
			_models: observable.deep,
			allModels: computed,
			setModel: action,
		});
	}

	abstract loadInMemory(id: string | undefined): T;
	abstract createNewModel(id: string): T;

	createModel(id: string): T {
		posthog.capture("create_model", {
			model: this.store_name,
			id,
		});
		const model = this.loadInMemory(id);
		model.smallId = model.getSmallId(this.getLength() + 1);
		this.setModel(id, model);
		this.save();
		return model;
	}

	getLength(): number {
		return this._models.size;
	}

	getById(id: string | undefined): T {
		if (id === undefined) throw new Error("Id is undefined");
		let el = this._models.get(id);
		// if we have an undefined model, we need to create it
		// and save it in the store
		if (!el) {
			el = this.loadInMemory(id);
			this.setModel(id, el);
			this.save();
		}

		return el;
	}

	load() {
		console.group(`[store:${this.store_name}] loading`);
		console.time(`[store:${this.store_name}] time to load`);

		const ids = localStorage.getItem(this.store_key);

		console.debug(`[store:${this.store_name}] ids`, ids);

		if (!ids) {
			console.debug(
				`[store:${this.store_name}] no store local storage found. Creating store.`,
			);
			console.groupEnd();
			this.save();
			return;
		}

		const idsSchema = z.array(z.string());
		const parsed = idsSchema.safeParse(JSON.parse(ids));

		if (!parsed.success) {
			throw new Error("Invalid store local storage found");
		}

		parsed.data.forEach((id: string) => {
			const model = this.loadInMemory(id);
			this.setModel(id, model);
		});

		this.validateAllModels();

		console.debug(
			`[store:${this.store_name}] loaded (${Object.keys(this._models).length} models)`,
		);

		console.timeEnd(`[store:${this.store_name}] time to load`);
		console.groupEnd();
	}

	validateAllModels() {
		let modelLength = this.getLength();
		this.allModels.forEach((model) => {
			if (model.smallId === "") {
				modelLength++;
				model.smallId = model.getSmallId(modelLength);
				model.save();
			}
		});
	}

	setModel(id: string, model: T) {
		this._models.set(id, model);
	}

	get allModels(): T[] {
		const val = Array.from(this._models.values());
		return val;
	}

	save() {
		console.group(`[store:${this.store_name}] saving`);

		const serialized = JSON.stringify(Array.from(this._models.keys()));
		localStorage.setItem(this.store_key, serialized);

		console.debug(
			`[store:${this.store_name}] saved (${Object.keys(this._models).length})`,
		);
		console.groupEnd();
	}
}
