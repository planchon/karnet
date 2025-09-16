"use client";

import type { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { observer } from "mobx-react";
import React, { createContext, useState } from "react";
import { cn } from "@/lib/utils";

type ChatRootProps = React.ComponentProps<"div">;

export const ChatContext = createContext<{
	model: GatewayLanguageModelEntry | null;
	setModel: (model: GatewayLanguageModelEntry) => void;
	mcp: string | null;
	setMcp: (mcp: string) => void;
	modelRef: React.RefObject<HTMLButtonElement | null>;
	mcpRef: React.RefObject<HTMLButtonElement | null>;
}>({
	model: null,
	setModel: () => {
		console.log("setModel");
	},
	mcp: null,
	setMcp: () => {
		console.log("setMcp");
	},
	modelRef: {
		current: null,
	},
	mcpRef: {
		current: null,
	},
});

export const ChatRoot = observer(function ChatRootInside({
	children,
	className,
	...props
}: ChatRootProps) {
	const [model, setModel] = useState<GatewayLanguageModelEntry | null>(null);
	const [mcp, setMcp] = useState<string | null>(null);
	const modelRef = React.useRef<HTMLButtonElement>(null);
	const mcpRef = React.useRef<HTMLButtonElement>(null);

	return (
		<ChatContext.Provider
			value={{ model, setModel, mcp, setMcp, modelRef, mcpRef }}
		>
			<div className={cn(className)} {...props}>
				{children}
			</div>
		</ChatContext.Provider>
	);
});
