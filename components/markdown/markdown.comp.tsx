"use client";

import type { UIMessage } from "@ai-sdk/react";
import type { HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import { Streamdown } from "streamdown";

export const Markdown = ({
	message,
	...props
}: { message: UIMessage } & HTMLAttributes<HTMLDivElement>) => {
	const renderable = message.parts.filter((part) => part.type === "text");
	return renderable.map((part, index) => (
		<Streamdown key={`${message.id}-${index}`}>{part.text}</Streamdown>
	));
};
