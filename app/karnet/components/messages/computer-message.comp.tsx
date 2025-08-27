"use client";

import { Markdown } from "../markdown/markdown.comp";

type ComputerMessageProps = {
	content: string;
};

export const ComputerMessage = ({ content }: ComputerMessageProps) => {
	return <Markdown content={content} id="computer-message" />;
};
