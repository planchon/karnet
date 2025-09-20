"use client";

import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { type EditorState, Plugin, type Transaction } from "@tiptap/pm/state";

export type NodeWithDeleteOptions = {
	onNodeDelete?: () => void;
};

/**
 * Creates a ProseMirror plugin that calls onNodeDelete when a node of the given type is deleted.
 * @param nodeTypeName The name of the node type to watch for deletion
 * @param onNodeDelete The callback to call with the deleted node
 */
export function createOnNodeDeletePlugin(
	nodeTypeName: string,
	onNodeDelete?: () => void,
) {
	return new Plugin({
		state: {
			init: (_: unknown, { doc }: { doc: ProseMirrorNode }) => doc,
			apply: (
				tr: Transaction,
				prev: unknown,
				oldState: EditorState,
				newState: EditorState,
			) => {
				if (!onNodeDelete) {
					return prev;
				}
				if (!tr.docChanged) {
					return prev;
				}

				const oldNodes: { node: ProseMirrorNode; pos: number }[] = [];
				oldState.doc.descendants((node: ProseMirrorNode, pos: number) => {
					if (node.type.name === nodeTypeName) {
						oldNodes.push({ node, pos });
					}
				});

				const newNodes: Set<number> = new Set();
				newState.doc.descendants((node: ProseMirrorNode, pos: number) => {
					if (node.type.name === nodeTypeName) {
						newNodes.add(pos);
					}
				});

				if (oldNodes.length > 0 && newNodes.size === 0) {
					onNodeDelete();
				}

				return prev;
			},
		},
	});
}
