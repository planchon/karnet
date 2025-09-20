import { makeObservable } from "mobx";
import { AbstractModel } from "./abstract.model";

export class UserModel extends AbstractModel {
	email: string = "anonymous@example.com";

	constructor(props: Partial<UserModel> & { id: string }) {
		super(props);

		makeObservable(this, {});

		this.load();
	}

	generate_id() {
		return "p6n-user";
	}

	getSmallId(id: number): string {
		return `USER-${id}`;
	}

	toJSON() {
		return {
			...this,
		};
	}
}
