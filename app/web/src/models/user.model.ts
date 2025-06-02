import { makeObservable, observable } from "mobx";
import { AbstractModel } from "./abstract.model";

export class UserModel extends AbstractModel {
  name: string = "";
  email: string = "";

  constructor(props: Partial<UserModel>) {
    super(props);
    Object.assign(this, props);

    makeObservable(this, {
      name: observable,
      email: observable
    });
  }

  toJSON() {
    return {
      ...this
    };
  }
}
