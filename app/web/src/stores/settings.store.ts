import { SettingsModel } from "@/models/settings.model";
import { AbstractStore } from "./abstract.store";
import { RootStore } from "./root.store";
import { AnonymousUserId } from "./user.store";
import { computed } from "mobx";
import { makeObservable } from "mobx";

// we have one setting per user
// settings id = user id
export class SettingsStore extends AbstractStore<SettingsModel> {
  constructor(rootStore: RootStore) {
    super(rootStore);

    this.seed();

    makeObservable(this, {});
  }

  // this should always return a value
  // everybody starts as an anonymous user
  // then we get the setting model for the user from remote
  // meaning that the settings is always available
  getCurrent = (): SettingsModel => {
    const user = this.rootStore.userStore.getCurrentUser();

    if (user.id === AnonymousUserId) {
      return this._models[AnonymousUserId] as SettingsModel;
    }

    return this.getById(user.id) as SettingsModel;
  };

  seed() {
    const anonymousSettings = new SettingsModel({
      id: "anonymous",
      theme: "light"
    });
    this._models[AnonymousUserId] = anonymousSettings;
  }
}
