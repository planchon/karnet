import { Slash, SlashCmd, SlashCmdProvider } from "@poltion/slash-tiptap";
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
import { RewriteEnter } from "@/components/chat/extensions/enter";
import { ModelNode } from "@/components/chat/extensions/model.node";
import { modelSuggestion } from "@/components/chat/extensions/model-suggestion";
import { ToolsSuggestion } from "@/components/chat/extensions/tools-suggestion";
import { ComputerMessage } from "@/components/messages/computer-message.comp";
import { UserMessage } from "@/components/messages/user-message.comp";
import { cn } from "@/lib/utils";
import { messages as messagesMock } from "@/mocks/messages";

interface Message {
	id: string;
	content: string;
	sender: "user" | "assistant";
	timestamp: Date;
}

const modelSuggestionProcessed = modelSuggestion.flatMap(
	(group) => group.items,
);

export const ChatPage = observer(function ChatPage() {
	const [messages, setMessages] = useState<Message[]>(messagesMock);
	const modelRef = React.useRef<HTMLButtonElement>(null);
	const mcpRef = React.useRef<HTMLButtonElement>(null);
	const messagesEndRef = React.useRef<HTMLDivElement>(null);

	const [model, setModel] = useState<string | null>(null);
	const [mcp, setMcp] = useState<string | null>(null);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			Document.configure({
				HTMLAttributes: {
					class: "text-[13px] min-h-[1rem]",
				},
			}),
			Paragraph.configure({
				HTMLAttributes: {
					class: "text-[13px] min-h-[1rem] mt-0",
				},
			}),
			Text.configure({
				HTMLAttributes: {
					class: "text-[13px] min-h-[1rem]",
				},
			}),
			Placeholder.configure({
				placeholder: "use / for commands and @ for entities",
				emptyNodeClass:
					"placeholder:text-[13px] placeholder:min-h-[1rem] placeholder:mt-0",
			}),
			Slash.configure({
				suggestion: {
					// @ts-ignore
					items: () => modelSuggestion,
					char: "/",
				},
			}),
			RewriteEnter,
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

	if (!editor) return null;

	return (
		<div className="flex h-full w-full flex-col">
			<div className="overflow-y-auto flex justify-center">
				<div className="max-w-[900px] h-auto w-9/12 space-y-8 pt-12">
					{messages.map((message) => (
						<div key={message.id}>
							{message.sender === "user" ? (
								<UserMessage content={message.content} />
							) : (
								<ComputerMessage content={message.content} />
							)}
						</div>
					))}
					<div ref={messagesEndRef} className="h-[100px]"></div>
				</div>
			</div>
			<div className="absolute bottom-0 flex h-auto w-full items-center justify-center">
				<div className="h-full w-9/12 max-w-[900px] mr-[10px]">
					<Chat.Root>
						<div className="h-full w-full p-2">
							<SlashCmdProvider>
								<EditorContent className="w-full" editor={editor} />

								<SlashCmd.Root editor={editor}>
									<SlashCmd.Cmd
										className="bg-background z-50 h-auto w-[200px] rounded-md border transition-all"
										loop
									>
										<SlashCmd.Empty>No commands available</SlashCmd.Empty>
										<SlashCmd.List>
											{modelSuggestion.map((group, groupIndex) => (
												<>
													<SlashCmd.Group className="p-1">
														{group.items.map((item) => (
															<SlashCmd.Item
																value={item.title}
																onCommand={(val) => {
																	// @ts-ignore
																	item.command(val);
																}}
																disabled={item.disabled}
																className={cn(
																	"aria-selected:bg-sidebar-accent flex w-full cursor-pointer items-center space-x-2 rounded-sm p-2 text-left text-sm",
																	item.disabled && "opacity-50",
																)}
																key={item.title}
															>
																<div className="flex items-center space-x-2">
																	<item.icon className="h-4 w-4" />
																	<p className="text-sm font-medium">
																		{item.title}
																	</p>
																</div>
															</SlashCmd.Item>
														))}
													</SlashCmd.Group>
													<SlashCmd.Group>
														{groupIndex < modelSuggestion.length - 1 &&
															group.items.length > 0 && (
																<SlashCmd.Separator className="bg-border h-[1px] w-full" />
															)}
													</SlashCmd.Group>
												</>
											))}
										</SlashCmd.List>
									</SlashCmd.Cmd>
								</SlashCmd.Root>
							</SlashCmdProvider>
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
