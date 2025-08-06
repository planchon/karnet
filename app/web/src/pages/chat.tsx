import {
	IconAssembly,
	IconGlobe,
	IconSend,
	IconWebhook,
	IconWorldWww,
} from "@tabler/icons-react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, Node, useEditor } from "@tiptap/react";
import { Button } from "@ui/button";
import { Shortcut } from "@ui/shortcut";
import { SendIcon } from "lucide-react";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Chat } from "@/components/chat";
import { ComputerMessage } from "@/components/messages/computer-message.comp";
import { UserMessage } from "@/components/messages/user-message.comp";
import { messages as messagesMock } from "@/mocks/messages";

interface Message {
	id: string;
	content: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

export const ChatPage = observer(function ChatPage() {
	const [messages, setMessages] = useState<Message[]>(messagesMock);
	const modelRef = React.useRef<HTMLButtonElement>(null);
	const mcpRef = React.useRef<HTMLButtonElement>(null);
	const [model, setModel] = useState<string | null>(null);
	const [mcp, setMcp] = useState<string | null>(null);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			Document,
			Paragraph,
			Text,
			Placeholder.configure({
				placeholder: "use / for commands and @ for entities",
			}),
		],
		autofocus: "start",
		content: "",
		onUpdate: ({ editor: e }) => {
			const text = e.getText();
			console.log(text);
		},
	});

	React.useEffect(() => {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				if (!editor) return;
				editor.commands.blur();
			}

			if (["/", "t", " "].includes(e.key)) {
				e.preventDefault();
				if (!editor) return;
				editor.commands.focus();
			}
		});
	}, [editor]);

	const modelMCPHandler = (e: KeyboardEvent) => {
		if (editor?.isFocused) {
			return;
		}

		if (e.key === "m") {
			console.log("open model");
			modelRef.current?.click();
			e.preventDefault();
			return;
		}
		if (e.key === "s") {
			console.log("open mcp");
			mcpRef.current?.click();
			e.preventDefault();
			return;
		}

		if (e.key === "g" || e.key === "c") {
			return;
		}
	};

	React.useEffect(() => {
		document.addEventListener("keydown", modelMCPHandler);

		return () => {
			document.removeEventListener("keydown", modelMCPHandler);
		};
	}, []);

	return (
		<div className="flex h-full w-full flex-col">
			<div className="flex-1 overflow-y-auto p-4">
				<div className="mx-auto max-w-4xl space-y-8 pb-24">
					{messages.map((message) => (
						<div key={message.id}>
							{message.sender === "user" ? (
								<UserMessage content={message.content} />
							) : (
								<ComputerMessage content={message.content} />
							)}
						</div>
					))}
				</div>
			</div>
			<div className="absolute bottom-0 flex h-auto w-full items-center justify-center">
				<div className="h-full w-9/12 max-w-[900px]">
					<Chat.Root>
						<div className="h-full w-full p-2">
							<EditorContent className="w-full" editor={editor} />
						</div>
						<div className="flex w-full justify-between p-2 py-0 pl-1">
							<div className="flex items-center gap-0">
								<Chat.ModelSelect ref={modelRef} setModel={setModel} />
								<Chat.MCPSelect ref={mcpRef} setMcp={setMcp} />
							</div>
							<div className="pb-2">
								<Button className="h-8 rounded-sm px-2">
									<IconSend className="size-4" />
									Send
									<Shortcut shortcut={["⌘", "↵"]} nothen />
								</Button>
							</div>
						</div>
					</Chat.Root>
				</div>
			</div>
		</div>
	);
});
