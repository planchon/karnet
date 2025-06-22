import { AbstractModel } from "@/models/abstract.model";
import { makeObservable, observable } from "mobx";
import { RootStore } from "./root.store";
import { IsObject, IsString } from "class-validator";

export abstract class AbstractStore<T extends AbstractModel> {
  rootStore: RootStore;

  @IsObject()
  _models: Record<string, T> = {};

  @IsString()
  store_name: string = this.constructor.name;

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

  getById(id: string | undefined): T {
    if (id === undefined) throw new Error("Id is undefined");
    let el = this._models[id];
    if (!el) {
      el = this.loadInMemory(id);
      this._models[id] = el;
    }

    return el;
  }

  load() {
    const ids = localStorage.getItem(this.store_key);
    if (!ids) {
      console.error("No store local storage found for", this.store_key);
      return;
    }

    const parsed = JSON.parse(ids) as string[];
    parsed.forEach((id: string) => {
      const model = this.loadInMemory(id);
      this._models[id] = model;
    });
  }

  save() {
    console.log("[AbstractStore] start saving", this.store_key);

    const serialized = JSON.stringify(Object.keys(this._models));
    localStorage.setItem(this.store_key, serialized);
  }
}
