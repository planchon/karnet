import { makeObservable, observable } from "mobx";
import { AbstractModel } from "./abstract.model";
import { IsEmail, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class UserModel extends AbstractModel {
  @IsString()
  @IsNotEmpty()
  name: string = "Anonymous";

  @IsEmail()
  email: string = "anonymous@example.com";

  constructor(props: Partial<UserModel> & { id: string }) {
    super(props);

    makeObservable(this, {});

    this.load();
  }

  _id() {
    return "p6n-user";
  }

  toJSON() {
    return {
      ...this
    };
  }
}
