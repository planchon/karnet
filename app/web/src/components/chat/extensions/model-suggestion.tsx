import { Anthropic, Gemini, OpenAI } from "@lobehub/icons";
import type { Editor, Range } from "@tiptap/react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@ui/command";
import { Command as Cmd } from "cmdk";
import { useEffect, useRef, useState } from "react";

export const modelSuggestion = [
	{
		group: "OpenAI",
		items: [
			{
				title: "GPT 4o",
				searchTerms: ["gpt-4o"],
				icon: OpenAI,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("gpt-4o");
				},
			},
			{
				title: "GPT 4o Mini",
				searchTerms: ["gpt-4o-mini"],
				icon: OpenAI,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("gpt-4o-mini");
				},
			},
			{
				title: "GPT 5",
				searchTerms: ["gpt-5"],
				icon: OpenAI,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("gpt-5");
				},
			},
		],
	},
	{
		group: "Anthropic",
		items: [
			{
				title: "Claude 3.5 Sonnet",
				searchTerms: ["claude"],
				icon: Anthropic,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("claude-3-5-sonnet-20240620");
				},
			},
			{
				title: "Claude 4 Opus",
				searchTerms: ["claude 4 opus"],
				icon: Anthropic,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("claude-4-opus");
				},
			},
			{
				title: "Claude 4.1 Opus",
				searchTerms: ["claude 4.1 opus"],
				icon: Anthropic,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("claude-4.1-opus");
				},
			},
		],
	},
	{
		group: "Google",
		items: [
			{
				title: "Gemini 2.0 Flash",
				searchTerms: ["gemini 2.0 flash"],
				icon: Gemini,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("gemini-2.0-flash");
				},
			},
		],
	},
];

export const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];

interface ModelSuggestionComponentProps {
	query: string;
	range: Range;
	editor: Editor;
}

export const ModelSuggestionComponent = (
	props: ModelSuggestionComponentProps,
) => {
	const [query, setQuery] = useState("");
	const ref = useRef<HTMLDivElement>(null);

	const onChange = (query: string) => {
		setQuery(query);
	};

	useEffect(() => {
		setQuery(props.query);
	}, [props.query]);

	useEffect(() => {
		const abortController = new AbortController();

		document.addEventListener(
			"keydown",
			(event) => {
				if (navigationKeys.includes(event.key)) {
					// prevent default behavior of the key
					event.preventDefault();

					if (ref.current) {
						// dispatch the keydown event to the slash command
						ref.current.dispatchEvent(
							new KeyboardEvent("keydown", {
								key: event.key,
								cancelable: true,
								bubbles: true,
							}),
						);

						return false;
					}
				}
			},
			{
				signal: abortController.signal,
			},
		);

		return () => {
			abortController.abort();
		};
	}, []);

	return (
		<Command
			className="min-w-[200px] border"
			ref={ref}
			onKeyDown={(e) => e.stopPropagation()}
		>
			<Cmd.Input
				value={query}
				onValueChange={onChange}
				style={{ display: "none" }}
			/>
			<CommandEmpty>No results.</CommandEmpty>
			<CommandList className="max-h-[300px] overflow-y-auto scrollbar-thin">
				{modelSuggestion.map((model, index) => (
					<CommandGroup
						key={model.group}
						value={model.group}
						heading={model.group}
					>
						{model.items.map((item) => (
							<CommandItem
								key={item.title}
								value={item.title}
								onSelect={() => {
									item.command({ editor: props.editor, range: props.range });
								}}
							>
								<item.icon />
								{item.title}
							</CommandItem>
						))}
						{index !== modelSuggestion.length - 1 && (
							<CommandSeparator className="mt-1" />
						)}
					</CommandGroup>
				))}
			</CommandList>
		</Command>
	);
};
