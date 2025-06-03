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
