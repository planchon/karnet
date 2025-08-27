import { UserModel } from "@/models/user.model";
import { AbstractStore } from "./abstract.store";
import { computed, makeObservable } from "mobx";
import { RootStore } from "./root.store";

export const AnonymousUserId = "anonymous" as const;

export class UserStore extends AbstractStore<UserModel> {
  constructor(rootStore: RootStore) {
    super(rootStore);

    // seed the anonymous user
    const anonymousUser = new UserModel({
      id: AnonymousUserId,
      name: "Anonymous",
      email: "anonymous@example.com"
    });
    this.setModel(AnonymousUserId, anonymousUser);

    makeObservable(this, {});
  }

  loadInMemory(id: string | undefined): UserModel {
    if (id === undefined) throw new Error("Id is undefined");
    return new UserModel({ id });
  }

  createNewModel(id: string): UserModel {
    throw new Error("User model is not creatable");
  }
}
