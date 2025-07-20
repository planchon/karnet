import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { EditorContent, Node, useEditor } from "@tiptap/react";
import { DeadlineNode } from "./extensions/deadline";
import { PriorityNode } from "./extensions/priorities";

export function TaskInputComp() {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			Node.create({
				name: "oneLine",
				topNode: true,
				content: "block",
			}),
			Paragraph,
			Text,
			PriorityNode,
			DeadlineNode,
		],
		autofocus: "start",
		content: "",
	});

	return <EditorContent className="w-full" editor={editor} />;
}
