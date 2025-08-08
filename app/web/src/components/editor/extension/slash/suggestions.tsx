import {
	IconChartDots3,
	IconCode,
	IconH1,
	IconH2,
	IconH3,
	IconListCheck,
	IconListNumbers,
	IconPencil,
	IconPhoto,
	IconQuote,
	IconTable,
} from "@tabler/icons-react";
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
import { generateId } from "@/lib/utils";
import { rootStore } from "@/stores/root.store";

export const allSuggestions = [
	{
		group: "Headings",
		items: [
			{
				title: "Heading 1",
				searchTerms: ["h1"],
				icon: IconH1,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor
						.chain()
						.focus()
						.deleteRange(range)
						.toggleHeading({ level: 1 })
						.run();
				},
			},
			{
				title: "Heading 2",
				searchTerms: ["h2"],
				icon: IconH2,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor
						.chain()
						.focus()
						.deleteRange(range)
						.toggleHeading({ level: 2 })
						.run();
				},
			},
			{
				title: "Heading 3",
				searchTerms: ["h3"],
				icon: IconH3,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor
						.chain()
						.focus()
						.deleteRange(range)
						.toggleHeading({ level: 3 })
						.run();
				},
			},
		],
	},
	{
		group: "Lists",
		items: [
			{
				title: "Bullet List",
				searchTerms: ["unordered", "point"],
				icon: IconListCheck,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).toggleBulletList().run();
				},
			},
			{
				title: "Ordered List",
				searchTerms: ["ordered", "point", "numbers"],
				icon: IconListNumbers,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).toggleOrderedList().run();
				},
			},
			{
				title: "Task List",
				searchTerms: ["task", "point"],
				icon: IconListCheck,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).toggleTaskList().run();
				},
			},
		],
	},
	{
		group: "Media",
		items: [
			{
				title: "Image",
				searchTerms: ["image"],
				icon: IconPhoto,
				disabled: true,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {},
			},
			{
				title: "Sketch",
				searchTerms: ["sketch"],
				icon: IconPencil,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					const id = Object.values(rootStore.sketchesStore.allModels)[0]?.id;
					if (!id) {
						console.debug("No sketch found");
						return;
					}
					const nodeUniqueId = generateId();
					editor.chain().focus().deleteRange(range).run();
					editor
						.chain()
						.focus()
						.insertContent(
							`<tldraw id="${id}" nodeUniqueId="${nodeUniqueId}"></tldraw>`,
						)
						.run();
				},
			},
			{
				title: "Diagram",
				searchTerms: ["diagram"],
				icon: IconChartDots3,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					const id = Object.values(rootStore.diagramStore.allModels)[0]?.id;
					if (!id) {
						console.debug("No diagram found");
						return;
					}
					const nodeUniqueId = generateId();
					editor.chain().focus().deleteRange(range).run();
					editor
						.chain()
						.focus()
						.insertContent(
							`<diagram id="${id}" nodeUniqueId="${nodeUniqueId}"></diagram>`,
						)
						.run();
				},
			},
		],
	},
	{
		group: "Others",
		items: [
			{
				title: "Code",
				searchTerms: ["code"],
				icon: IconCode,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					editor.chain().focus().setCodeBlock().run();
				},
			},
			{
				title: "Quote",
				searchTerms: ["quote"],
				icon: IconQuote,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					editor.chain().focus().setBlockquote().run();
				},
			},
			{
				title: "Table",
				searchTerms: ["table"],
				icon: IconTable,
				disabled: true,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {},
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

export const SlashSuggestions = (props: ModelSuggestionComponentProps) => {
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
				console.log("keydown slash suggestions", event);
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
			id="SLASH_EXTENSION_DOM_ID"
		>
			<Cmd.Input
				value={query}
				onValueChange={onChange}
				style={{ display: "none" }}
			/>
			<CommandEmpty>No results.</CommandEmpty>
			<CommandList className="max-h-[300px] overflow-y-auto scrollbar-thin">
				{allSuggestions.map((model, index) => (
					<CommandGroup key={model.group} value={model.group}>
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
						{index !== allSuggestions.length - 1 && (
							<CommandSeparator className="mt-1" />
						)}
					</CommandGroup>
				))}
			</CommandList>
		</Command>
	);
};
