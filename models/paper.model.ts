import { action, makeObservable, observable, reaction, toJS } from "mobx";
import { AbstractModel } from "./abstract.model";

// this model is only used to store the metadata of the document
// everything else is stored in the document itself
// tiptap is storing the content by itself
export class PaperModel extends AbstractModel {
	type = "paper" as const;

	paper_text = "";

	content: unknown = {
		type: "doc",
		content: [],
	};

	constructor(
		props: Partial<PaperModel> & {
			id: string;
		},
	) {
		super(props);

		makeObservable(this, {
			name: observable,
			content: observable,
			setContent: action,
			getContent: action,
		});

		this.load();

		reaction(
			() => this.name,
			() => {
				this.save();
			},
			{
				delay: 100,
			},
		);

		reaction(
			() => this.content,
			() => {
				this.save();
			},
			{
				delay: 500,
			},
		);
	}

	toJSON() {
		return toJS(this);
	}

	getSmallId(id: number): string {
		return `DOCS-${id}`;
	}

	setContent(content: unknown) {
		this.content = content;
	}

	getContent() {
		return toJS(this.content);
	}

	generate_id() {
		return `p6n-paper-metadata-${this._id}`;
	}
}
