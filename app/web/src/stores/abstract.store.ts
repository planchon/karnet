import { AbstractModel } from "@/models/abstract.model";
import { makeObservable, observable } from "mobx";
import { RootStore } from "./root.store";

export class AbstractStore<T extends AbstractModel> {
  rootStore: RootStore;
  _models: Record<string, T> = {};

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeObservable(this, {
      _models: observable
    });
  }

  getById = (id: string): T | undefined => {
    return this._models[id];
  };
}
