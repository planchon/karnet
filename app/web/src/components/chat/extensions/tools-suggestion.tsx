import type { Editor, Range } from "@tiptap/react";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@ui/command";
import { Command as Cmd } from "cmdk";
import React, { useEffect, useState } from "react";
import { FaImage, FaInternetExplorer, FaReact } from "react-icons/fa";

export const ToolsSuggestion = [
	{
		group: "Search",
		items: [
			{
				title: "Web",
				icon: FaInternetExplorer,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("web");
				},
			},
			{
				title: "Image",
				icon: FaImage,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("image");
				},
			},
		],
	},
	{
		group: "MCP",
		items: [
			{
				title: "React",
				icon: FaReact,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("react");
				},
			},
		],
	},
];

export const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];

interface ToolsSuggestionComponentProps {
	query: string;
	range: Range;
	editor: Editor;
}

export const ToolsSuggestionComponent = (
	props: ToolsSuggestionComponentProps,
) => {
	const [query, setQuery] = useState("");
	const ref = React.useRef<HTMLDivElement>(null);

	const onChange = (query: string) => {
		setQuery(query);
	};

	useEffect(() => {
		console.log("query", props.query);
		setQuery(props.query);
	}, [props.query]);

	useEffect(() => {
		console.log("range", props.range);
	}, [props.range]);

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
			<CommandList>
				{ToolsSuggestion.map((tool, index) => (
					<CommandGroup
						key={tool.group}
						value={tool.group}
						heading={tool.group}
					>
						{tool.items.map((item) => (
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
						{index !== ToolsSuggestion.length - 1 && (
							<CommandSeparator className="mt-1" />
						)}
					</CommandGroup>
				))}
			</CommandList>
		</Command>
	);
};
