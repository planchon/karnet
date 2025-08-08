// --- Tiptap Node ---
import { ImageUploadNode } from "@editor/nodes/image-upload-node/image-upload-node-extension";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import {
	type Editor,
	EditorContent,
	EditorContext,
	useEditor,
} from "@tiptap/react";
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import * as React from "react";
// --- Custom Extensions ---
import { Selection } from "../extension/select/selection-extension";
import { TrailingNode } from "../extension/trailing/trailing-node-extension";

import "@editor/nodes/code-block-node/code-block-node.scss";
import "@editor/nodes/list-node/list-node.scss";
import "@editor/nodes/image-node/image-node.scss";
import "@editor/nodes/paragraph-node/paragraph-node.scss";

import { useCursorVisibility } from "@editor/hooks/use-cursor-visibility";
// --- Hooks ---
import { useMobile } from "@editor/hooks/use-mobile";
import { useWindowSize } from "@editor/hooks/use-window-size";

// --- Lib ---
import {
	cn,
	handleImageUpload,
	MAX_FILE_SIZE,
} from "@editor/utils/tiptap-utils";

// --- Styles ---
import "./editor.scss";

import { DiagramMenu } from "@editor/extension/bubble-menu/diagram-menu";
import { SketchMenu } from "@editor/extension/bubble-menu/tldraw-menu";
import { Shortcut } from "@editor/extension/shortcut/shortcut";
import { SlashCommand } from "@editor/extension/slash/slash-extension";
import {
	allSuggestions,
	navigationKeys,
} from "@editor/extension/slash/suggestions";
import { DiagramNode } from "@editor/nodes/diagram/diagram.node";
import { TldrawNode } from "@editor/nodes/tldraw/TldrawNode";
import Collaboration from "@tiptap/extension-collaboration";
import { throttle } from "lodash";
import * as Y from "yjs";
import { useStores } from "@/hooks/useStores";
import { BubbleMenuComp } from "../extension/bubble-menu/bubble-menu";

type Props = {
	id: string;
};

const doc = new Y.Doc();

const suggestions = allSuggestions.flatMap((group) => group.items);

export function SimpleEditor({ id }: Props) {
	const { paperStore } = useStores();

	const isMobile = useMobile();
	const windowSize = useWindowSize();
	const [mobileView, setMobileView] = React.useState<
		"main" | "highlighter" | "link"
	>("main");
	const toolbarRef = React.useRef<HTMLDivElement>(null);

	const editor: Editor | null = useEditor({
		immediatelyRender: false,
		autofocus: "start",
		shouldRerenderOnTransaction: false,
		editorProps: {
			attributes: {
				autocomplete: "off",
				autocorrect: "off",
				autocapitalize: "off",
				"aria-label": "Main content area, start typing to enter text.",
			},
			handleDOMEvents: {
				keydown: (_, v) => {
					if (navigationKeys.includes(v.key)) {
						const slashCommand = document.getElementById(
							"SLASH_EXTENSION_DOM_ID",
						);
						if (slashCommand) {
							return true;
						}
					}
				},
			},
		},
		extensions: [
			Shortcut,
			StarterKit.configure({}),
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Underline,
			TaskList,
			TaskItem.configure({ nested: true }),
			Highlight.configure({ multicolor: true }),
			Image,
			Typography,
			Superscript,
			Subscript,
			SlashCommand,
			Selection,
			ImageUploadNode.configure({
				accept: "image/*",
				maxSize: MAX_FILE_SIZE,
				limit: 3,
				upload: handleImageUpload,
				onError: (error) => console.error("Upload failed:", error),
			}),
			TrailingNode,
			Collaboration.configure({
				document: doc,
			}),
			Placeholder.configure({
				placeholder: ({ node }) => {
					if (node.type.name === "heading") {
						return "Heading";
					}
					if (node.type.name === "paragraph") {
						return "Write something (or / to open commands)...";
					}
					return "";
				},
			}),
			TldrawNode,
			DiagramNode,
		],
	});

	React.useEffect(() => {
		if (!isMobile && mobileView !== "main") {
			setMobileView("main");
		}
	}, [isMobile, mobileView]);

	React.useEffect(() => {
		if (!id || !editor) return;

		const paper = paperStore.getById(id);

		if (paper) {
			editor.commands.setContent(paper.getContent() as any);
		} else {
			editor.commands.setContent("");
		}

		const save = throttle(() => {
			if (paper) {
				paper.setContent(editor.getJSON());
			} else {
				console.error("Paper not found while saving");
			}
		}, 300);

		editor.on("update", () => {
			save();
		});

		return () => {
			editor.off("update");
		};
	}, [id, editor, paperStore]);

	React.useEffect(() => {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				if (!editor) return;
				editor.commands.blur();
			}
		});
	}, [editor]);

	if (!editor) return null;

	return (
		<EditorContext.Provider value={{ editor }}>
			<div className="content-wrapper">
				<BubbleMenuComp editor={editor} />
				<SketchMenu editor={editor} />
				<DiagramMenu editor={editor} />
				<EditorContent
					editor={editor}
					role="presentation"
					className="simple-editor-content"
				/>
			</div>
		</EditorContext.Provider>
	);
}
