"use client";

import { useChat } from "@ai-sdk/react";
import { IconSend } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { Shortcut } from "@ui/shortcut";
import { motion } from "framer-motion";
import { observer } from "mobx-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Chat } from "@/components/chat";
import { Markdown } from "@/components/markdown/markdown.comp";
import { useShortcut } from "@/hooks/useShortcut";
import { cn } from "@/lib/utils";

export default observer(function ChatPage() {
	const [input, setInput] = useState("");
	const { id } = useParams();
	const location = usePathname();
	const { messages, sendMessage, status } = useChat();

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
		sendMessage(
			{ text: input },
			{
				body: {
					modelId: "google/gemini-2.5-flash-lite",
				},
			},
		);
		setInput("");
		// window.history.pushState(null, "", `/chat/${chat._id}`);
	};

	useShortcut("Control+Enter", onSend);
	useShortcut("Command+Enter", onSend);

	return (
		<div className="flex h-full w-full flex-col">
			{messages.length > 0 && (
				<div className="absolute h-full w-full overflow-auto">
					<div className="pt-16 pb-64 mx-auto h-full gap-y-8 flex flex-col w-9/12 max-w-[1000px]">
						{messages.map((message) => {
							if (message.role === "user") {
								return (
									<div className="flex w-full justify-end" key={message.id}>
										<Markdown
											className="bg-blue-50 rounded-md p-3 border border-blue-100"
											message={message}
											key={message.id}
										/>
									</div>
								);
							}
							if (message.role === "assistant") {
								return (
									<div className="flex w-full justify-start" key={message.id}>
										<Markdown message={message} key={message.id} />
									</div>
								);
							}
						})}
					</div>
				</div>
			)}
			<div
				className={cn(
					"flex h-full w-full flex-col items-center",
					messages.length === 0 && "h-full",
				)}
				style={{
					justifyContent: inputPosition === "center" ? "center" : "flex-end",
					paddingBottom: inputPosition === "center" ? "0px" : "12px",
				}}
			>
				<motion.div
					className="z-10 w-9/12 max-w-[900px] overflow-hidden rounded-xl border bg-gray-100"
					layout
					transition={{
						duration: 0.2,
						ease: "easeInOut",
					}}
				>
					<Chat.Root>
						<div className="h-full w-full rounded-b-xl bg-white p-2 shadow-md">
							<Chat.Input className="h-20" onChange={setInput} />
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
