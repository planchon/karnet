import { AbstractModel } from "@/models/abstract.model";
import { makeObservable, observable } from "mobx";
import { RootStore } from "./root.store";
import { IsObject, IsString } from "class-validator";

export class AbstractStore<T extends AbstractModel> {
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

  getById = (id: string): T | undefined => {
    return this._models[id];
  };

  setById = (id: string, model: T) => {
    this._models[id] = model;
  };

  saveToLocalStorage() {
    const ids = Object.keys(this._models);
    const serialized = JSON.stringify(ids);
    localStorage.setItem(this.store_key, serialized);
  }

  loadFromLocalStorage() {
    const serialized = localStorage.getItem(this.store_key);

    if (!serialized) {
      this._models = {};
      console.error("No store local storage found for", this.store_key);
      return;
    }

    const ids = JSON.parse(serialized);
    ids.forEach((id: string) => {
      const model = this.getById(id);
      if (model) model.loadFromLocalStorage();
    });
  }
}
