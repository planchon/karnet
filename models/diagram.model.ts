import { makeObservable, observable, reaction } from "mobx";
import { AbstractModel } from "./abstract.model";

export class DiagramModel extends AbstractModel {
	type = "diagram" as const;

	content = `sequenceDiagram
    Alice->John: Hello John, how are you?
    Note over Alice,John: A typical interaction
    John-->Alice: How are you?
    Alice->John: Great!
  `;

	constructor(props: Partial<DiagramModel> & { id: string }) {
		super(props);

		makeObservable(this, {
			content: observable,
			name: observable,
		});

		this.load();

		reaction(
			() => this.toJSON(),
			() => {
				this.save();
			},
			{
				delay: 1000,
			},
		);
	}

	toJSON() {
		return {
			...this,
		};
	}

	getSmallId(id: number): string {
		return `DIAG-${id}`;
	}

	setName(name: string) {
		this.name = name;
	}

	generate_id() {
		return `p6n-diagram-${this._id}`;
	}
}
