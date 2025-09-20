import { IsNotEmpty, IsString } from "class-validator";
import { action, makeObservable, observable, reaction, toJS } from "mobx";
import type { TLEditorSnapshot } from "tldraw";
import { AbstractModel } from "./abstract.model";

const emptySnapshot = {
	document: {
		store: {
			"document:document": {
				gridSize: 10,
				name: "",
				meta: {},
				id: "document:document",
				typeName: "document",
			},
			"page:page": {
				meta: {},
				id: "page:page",
				name: "Page 1",
				index: "a1",
				typeName: "page",
			},
		},
		schema: {
			schemaVersion: 2,
			sequences: {
				"com.tldraw.store": 4,
				"com.tldraw.asset": 1,
				"com.tldraw.camera": 1,
				"com.tldraw.document": 2,
				"com.tldraw.instance": 25,
				"com.tldraw.instance_page_state": 5,
				"com.tldraw.page": 1,
				"com.tldraw.instance_presence": 6,
				"com.tldraw.pointer": 1,
				"com.tldraw.shape": 4,
				"com.tldraw.asset.bookmark": 2,
				"com.tldraw.asset.image": 5,
				"com.tldraw.asset.video": 5,
				"com.tldraw.shape.arrow": 6,
				"com.tldraw.shape.bookmark": 2,
				"com.tldraw.shape.draw": 2,
				"com.tldraw.shape.embed": 4,
				"com.tldraw.shape.frame": 1,
				"com.tldraw.shape.geo": 10,
				"com.tldraw.shape.group": 0,
				"com.tldraw.shape.highlight": 1,
				"com.tldraw.shape.image": 5,
				"com.tldraw.shape.line": 5,
				"com.tldraw.shape.note": 9,
				"com.tldraw.shape.text": 3,
				"com.tldraw.shape.video": 3,
				"com.tldraw.binding.arrow": 1,
			},
		},
	},
	session: {
		version: 0,
		currentPageId: "page:page",
		exportBackground: true,
		isFocusMode: false,
		isDebugMode: false,
		isToolLocked: false,
		isGridMode: false,
		pageStates: [
			{
				pageId: "page:page",
				camera: { x: 0, y: 0, z: 1 },
				selectedShapeIds: [],
				focusedGroupId: null,
			},
		],
	},
};

// this model is only used to store the metadata of the sketch
// everything else is stored in the sketch itself
// tldraw is storing the content by itself
export class SketchModel extends AbstractModel {
	type = "sketch" as const;

	content: unknown = emptySnapshot;

	constructor(props: Partial<SketchModel> & { id: string }) {
		super(props);

		makeObservable(this, {
			name: observable,
			setName: action,
			content: observable,
			getSnapshot: action,
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

	generate_id() {
		return `p6n-sketch-metadata-${this._id}`;
	}

	getSmallId(id: number): string {
		return `SKCH-${id}`;
	}

	toJSON() {
		return {
			...this,
		};
	}

	getSnapshot() {
		return toJS(this.content);
	}

	setContent(content: TLEditorSnapshot) {
		this.content = content;
	}

	setName(name: string) {
		this.name = name;
	}
}
