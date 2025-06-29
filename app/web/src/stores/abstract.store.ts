import { AbstractModel } from "@/models/abstract.model";
import { makeObservable, observable } from "mobx";
import { RootStore } from "./root.store";
import { IsObject, IsString } from "class-validator";
import posthog from "posthog-js";

export abstract class AbstractStore<T extends AbstractModel> {
  rootStore: RootStore;

  @IsObject()
  _models: Record<string, T> = {};

  @IsString()
  store_name: string = "abstract";

  @IsString()
  store_key: string = `p6n-stores-${this.store_name}`;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      _models: observable
    });
  }

  abstract loadInMemory(id: string | undefined): T;
  abstract createNewModel(id: string): T;

  createModel(id: string): T {
    posthog.capture("create_model", {
      model: this.store_name,
      id
    });
    const model = this.loadInMemory(id);
    model.smallId = model.getSmallId(this.getLength() + 1);
    this._models[id] = model;
    this.save();
    return model;
  }

  getLength(): number {
    return Object.keys(this._models).length;
  }

  getById(id: string | undefined): T {
    if (id === undefined) throw new Error("Id is undefined");
    let el = this._models[id];
    // if we have an undefined model, we need to create it
    // and save it in the store
    if (!el) {
      el = this.loadInMemory(id);
      this._models[id] = el;
      this.save();
    }

    return el;
  }

  load() {
    console.group(`[store:${this.store_name}] loading`);

    const ids = localStorage.getItem(this.store_key);

    console.debug(`[store:${this.store_name}] ids`, ids);
    if (!ids) {
      console.debug(
        `[store:${this.store_name}] no store local storage found. Creating store.`
      );
      console.groupEnd();
      this._models = {};
      this.save();
      return;
    }

    const parsed = JSON.parse(ids) as string[];
    this._models = {};
    parsed.forEach((id: string) => {
      const model = this.loadInMemory(id);
      this._models[id] = model;
    });

    this.validateAllModels();

    console.debug(
      `[store:${this.store_name}] loaded (${Object.keys(this._models).length} models)`
    );
    posthog.capture("load_models", {
      model: this.store_name,
      count: Object.keys(this._models).length
    });
    console.groupEnd();
  }

  validateAllModels() {
    let modelLength = this.getLength();
    Object.values(this._models).forEach((model) => {
      if (model.smallId === "") {
        modelLength++;
        model.smallId = model.getSmallId(modelLength);
        model.save();
      }
    });
  }

  allModels(): T[] {
    return Object.values(this._models);
  }

  save() {
    console.group(`[store:${this.store_name}] saving`);

    const serialized = JSON.stringify(Object.keys(this._models));
    localStorage.setItem(this.store_key, serialized);

    console.debug(`[store:${this.store_name}] saved (${this._models.length})`);
    console.groupEnd();
  }
}
