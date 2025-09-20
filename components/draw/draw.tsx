"use client";

import { throttle } from "lodash";
import {
	createTLStore,
	type Editor,
	getSnapshot,
	loadSnapshot,
	type TLEditorSnapshot,
	type TLUiComponents,
	type TLUiOverrides,
	Tldraw,
	useEditor,
} from "tldraw";
import { Grid } from "./grid";
import { Toolbar } from "./toolbar";
import "tldraw/tldraw.css";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useStores } from "@/hooks/useStores";

const components: TLUiComponents & { Grid: typeof Grid } = {
	MenuPanel: null,
	Grid,
	Toolbar: Toolbar as TLUiComponents["Toolbar"],
};

type DrawProps = {
	id: string;
	callback: (editor: Editor) => void;
};
const overrides: TLUiOverrides = {
	// @ts-ignore
	actions(editor, actions, helpers) {
		const newActions = {
			...actions,
			"toggle-grid": {
				...actions["toggle-grid"],
				id: "toggle-grid",
				kbd: "Shift+G",
			},
		};

		return newActions;
	},
};

function Draw({ id, callback }: DrawProps) {
	const store = useMemo(() => createTLStore(), []);
	const { sketchesStore } = useStores();

	const sketch = sketchesStore.getById(id);

	useLayoutEffect(() => {
		if (!sketch) {
			return;
		}

		loadSnapshot(store, sketch.getSnapshot() as TLEditorSnapshot);

		const cleanUp = store.listen(
			throttle(() => {
				const snapshot = getSnapshot(store);
				sketch.setContent(snapshot);
			}, 500),
			{
				source: "user",
				scope: "document",
			},
		);

		return () => {
			cleanUp();
		};
	}, [sketch]);

	if (!sketch) {
		return null;
	}

	return (
		<div className="relative h-full w-full">
			<Tldraw
				components={components}
				overrides={overrides}
				store={store}
				onMount={(e) => {
					e.user.updateUserPreferences({
						isSnapMode: true,
					});
					e.updateInstanceState({
						isGridMode: true,
					});
					callback(e);
				}}
			/>
		</div>
	);
}

export { Draw };
