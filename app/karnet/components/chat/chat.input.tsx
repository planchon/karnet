"use client";

import type { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import { MCP } from "@lobehub/icons";
import { IconBrain } from "@tabler/icons-react";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { Button } from "@ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Shortcut } from "@ui/shortcut";
import { observer } from "mobx-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { modelProviders, ProviderIcons } from "@/ai/models";
import { models } from "@/data/model";
import { commands } from "@/data/tools";
import { cn } from "@/lib/utils";
import { ChatContext } from "./chat.root";
import { RewriteEnter } from "./extensions/enter";
import { ModelSuggestionComponent } from "./extensions/model-suggestion";
import { renderItems } from "./extensions/textual-commands";
import { ToolsSuggestionComponent } from "./extensions/tools-suggestion";

export const ChatModelSelect = observer(function ChatModelSelectInner() {
	const { model, setModel, modelRef } = useContext(ChatContext);
	const [open, setOpen] = useState(false);

	useHotkeys(
		"m",
		() => {
			setOpen(true);
		},
		{
			preventDefault: true,
			useKey: true,
		},
	);

	function handleSelect(value: GatewayLanguageModelEntry) {
		setModel(value);
		setOpen(false);
	}

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger className="outline-none ring-0" ref={modelRef} asChild>
				<Button
					className="h-6 px-2 text-gray-700 outline-none ring-0"
					size="sm"
					variant="ghost"
				>
					<ProviderIcons provider={model?.specification.provider || ""} />
					{model ? model.name : "Model"}
					<Shortcut shortcut={["M"]} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search model..." />
					<CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
						<CommandEmpty>No model found.</CommandEmpty>
						{Object.entries(modelProviders).map(([provider, models]) => (
							<CommandGroup heading={provider} key={provider}>
								{models.map((m) => (
									<CommandItem
										key={m.id}
										onSelect={() => handleSelect(m)}
										value={m.id}
									>
										<ProviderIcons provider={provider} />
										{m.name}
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
});

const mcpProviders = [
	{
		category: "Database",
		items: [
			{
				name: "Postgres",
				value: "postgres",
			},
			{
				name: "MongoDB",
				value: "mongodb",
			},
		],
	},
	{
		category: "Search",
		items: [
			{
				name: "Google",
				value: "google",
			},
			{
				name: "Wikipedia",
				value: "wikipedia",
			},
		],
	},
	{
		category: "Clouds",
		items: [
			{
				name: "AWS",
				value: "aws",
			},
			{
				name: "GCP",
				value: "gcp",
			},
		],
	},
];
export const ChatMCPSelect = observer(function ChatMCPSelectInner() {
	const { mcp, setMcp, mcpRef } = useContext(ChatContext);
	const [open, setOpen] = useState(false);

	useHotkeys(
		"s",
		() => {
			setOpen(true);
		},
		{
			preventDefault: true,
			useKey: true,
		},
	);

	function handleSelect(value: string) {
		setMcp(value);
		setOpen(false);
	}

	function getRenderingName() {
		const mcpItem = commands
			.flatMap((provider) => provider.tools)
			.find((mcpItemIterator) => mcpItemIterator.id === mcp);
		return mcpItem?.name;
	}

	function getRenderingIcon() {
		const mcpItem = commands
			.flatMap((provider) => provider.tools)
			.find((mcpItemIterator) => mcpItemIterator.id === mcp);

		if (!mcpItem) {
			return <MCP className="size-4" />;
		}

		return <mcpItem.icon className="size-4" />;
	}

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger className="outline-none ring-0" ref={mcpRef} asChild>
				<Button
					className="h-6 px-2 text-gray-700 outline-none ring-0"
					size="sm"
					variant="ghost"
				>
					{getRenderingIcon()}
					{mcp ? getRenderingName() : "MCP"}
					<Shortcut nothen shortcut={["S"]} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search MCP..." />
					<CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
						<CommandEmpty>No MCP found.</CommandEmpty>
						{commands.map((provider) => (
							<CommandGroup heading={provider.name} key={provider.name}>
								{provider.tools.map((item) => (
									<CommandItem
										key={item.id}
										onSelect={() => handleSelect(item.id)}
										value={item.id}
									>
										<item.icon />
										{item.name}
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
});

export const ChatInput = observer(function ChatInputInside({
	className,
	onChange,
}: {
	className?: string;
	onChange?: (value: string) => void;
}) {
	const modelRef = useRef<HTMLButtonElement>(null);
	const mcpRef = useRef<HTMLButtonElement>(null);

	const { setModel, setMcp } = useContext(ChatContext);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			Document.configure({
				HTMLAttributes: {
					class: "text-sm!",
				},
			}),
			Paragraph.configure({
				HTMLAttributes: {
					class: "min-h-4 mt-0",
					// the tailwind text-sm! is not working here
					style: "font-size: 13px;",
				},
			}),
			Text.configure({
				HTMLAttributes: {
					class: "text-sm! min-h-4",
				},
			}),
			Placeholder.configure({
				placeholder: "use / for commands and @ for entities",
			}),
			Mention.configure({
				suggestions: [
					{
						char: "/",
						render: () => {
							return renderItems(
								ToolsSuggestionComponent,
								(props: { id: string }) => {
									setMcp(props.id);
								},
							);
						},
					},
					{
						char: "@",
						render: () => {
							return renderItems(
								ModelSuggestionComponent,
								(props: { id: string }) => {
									setModel(props.id);
								},
							);
						},
					},
				],
			}),
			RewriteEnter,
		],
		autofocus: "start",
		content: "",
		editorProps: {
			attributes: {
				style: "font-size: 13px;",
			},
		},
		onUpdate: ({ editor: e }) => {
			const text = e.getText();
			onChange?.(text);
		},
	});

	useEffect(() => {
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				// biome-ignore lint/style/useBlockStatements: useless
				if (!editor) return;
				editor.commands.blur();
			}

			if (["/", "t", " "].includes(e.key)) {
				e.preventDefault();
				// biome-ignore lint/style/useBlockStatements: useless
				if (!editor) return;
				editor.commands.focus();
			}
		});
	}, [editor]);

	const modelMCPHandler = (e: KeyboardEvent) => {
		if (editor?.isFocused) {
			return;
		}

		if (e.key === "g" || e.key === "c") {
			return;
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: mcp change every render
	useEffect(() => {
		document.addEventListener("keydown", modelMCPHandler);

		return () => {
			document.removeEventListener("keydown", modelMCPHandler);
		};
	}, []);

	// biome-ignore lint/style/useBlockStatements: useless
	if (!editor) return null;

	return (
		<EditorContent
			className={cn("w-full cursor-text text-sm!", className)}
			editor={editor}
			onClick={() => {
				editor.commands.focus();
			}}
		/>
	);
});
