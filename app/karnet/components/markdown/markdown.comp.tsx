"use client";

import type { UIMessage } from "@ai-sdk/react";
import type { HTMLAttributes } from "react";
import { Streamdown } from "streamdown";

export const Markdown = ({
	message,
	...props
}: { message: UIMessage } & HTMLAttributes<HTMLDivElement>) => {
	const renderable = message.parts.filter((part) => part.type === "text");
	return renderable.map((part, index) => (
		<Streamdown key={`${message.id}-${index}`} className={props.className}>
			{part.text}
		</Streamdown>
	));
};
