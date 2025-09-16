"use client";

import { useChat } from "@ai-sdk/react";
import { IconSend } from "@tabler/icons-react";
import type { Editor } from "@tiptap/react";
import { Button } from "@ui/button";
import { Shortcut } from "@ui/shortcut";
import { motion } from "framer-motion";
import { observer } from "mobx-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Chat } from "@/components/chat";
import { useShortcut } from "@/hooks/useShortcut";
import { cn } from "@/lib/utils";

export default observer(function ChatPage() {
	const { id } = useParams();
	const location = usePathname();
	const editorRef = useRef<Editor | null>(null);

	const { messages, sendMessage } = useChat();

	const [inputPosition, setInputPosition] = useState<"center" | "bottom">(
		id ? "bottom" : "center",
	);

	// i want to keep the animation when im on the chat page
	useEffect(() => {
		if (location === "/chat") {
			setInputPosition("center");
		}
	}, [location]);

	const onSend = () => {
		setInputPosition("bottom");

		const text = editorRef.current?.getText();
		if (!text) {
			alert("Please enter a message");
			return;
		}

		sendMessage(
			{ text: text },
			{
				body: {
					modelId: "google/gemini-2.5-flash-lite",
				},
			},
		);

		// clear the editor
		editorRef.current?.commands.setContent("");
		// window.history.pushState(null, "", `/chat/${chat._id}`);
	};

	useShortcut("Control+Enter", onSend);
	useShortcut("Command+Enter", onSend);

	return (
		<div className="flex w-full flex-col h-full">
			<Conversation className="relative w-full h-full">
				<ConversationContent className="w-8/12 mx-auto pb-64">
					{messages.map((message) => (
						<Message from={message.role} key={message.id}>
							<MessageContent variant="flat">
								{message.parts.map((part, i) => {
									switch (part.type) {
										case "text": // we don't use any reasoning or tool calls in this example
											return (
												<Response key={`${message.id}-${i}`}>
													{part.text}
												</Response>
											);
										default:
											return null;
									}
								})}
							</MessageContent>
						</Message>
					))}
				</ConversationContent>
				<ConversationScrollButton className="bottom-[180px]" />
			</Conversation>
			<div
				className={cn(
					"absolute bottom-0 flex h-full w-full flex-col items-center z-0 pointer-events-none",
				)}
				style={{
					justifyContent: inputPosition === "center" ? "center" : "flex-end",
					paddingBottom: inputPosition === "center" ? "0px" : "12px",
				}}
			>
				<motion.div
					className="z-50 w-9/12 max-w-[900px] overflow-hidden rounded-xl border bg-gray-100 pointer-events-auto"
					layout
					transition={{
						duration: 0.2,
						ease: "easeInOut",
					}}
				>
					<Chat.Root>
						<div className="h-full w-full rounded-b-xl bg-white p-2 shadow-md">
							<Chat.Input className="h-20" ref={editorRef} />
						</div>
						<div className="flex w-full justify-between p-2 py-0 pt-3 pl-1">
							<div className="flex items-center gap-0">
								<Chat.ModelSelect />
								<Chat.MCPSelect />
							</div>
							<div className="pb-2">
								<Button
									className="h-8 rounded-sm pr-[6px]! pl-[8px]!"
									onClick={onSend}
								>
									<IconSend className="size-4" />
									Send
									<Shortcut nothen shortcut={["⌘", "↵"]} />
								</Button>
							</div>
						</div>
					</Chat.Root>
				</motion.div>
			</div>
		</div>
	);
});
