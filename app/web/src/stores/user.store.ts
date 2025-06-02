import { UserModel } from "@/models/user.model";
import { AbstractStore } from "./abstract.store";
import { computed, makeObservable } from "mobx";
import { RootStore } from "./root.store";

export const AnonymousUserId = "anonymous" as const;

function getCurrentUserId() {
  const user = localStorage.getItem("user_id");
  if (!user) {
    return AnonymousUserId;
  }
  return user;
}

export class UserStore extends AbstractStore<UserModel> {
  constructor(rootStore: RootStore) {
    super(rootStore);

    // seed the anonymous user
    const anonymousUser = new UserModel({
      id: AnonymousUserId,
      name: "Anonymous",
      email: "anonymous@example.com"
    });
    this._models[AnonymousUserId] = anonymousUser;

    makeObservable(this, {});
  }

  getCurrentUser(): UserModel {
    const userId = getCurrentUserId();
    if (userId === AnonymousUserId) {
      // we are sure because we seeded the anonymous user
      return this._models[AnonymousUserId] as UserModel;
    }

    return this.getById(userId) as UserModel;
  }
}
