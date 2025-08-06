import { IconAssembly, IconBrain } from "@tabler/icons-react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, Node, useEditor } from "@tiptap/react";
import { Button } from "@ui/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Shortcut } from "@ui/shortcut";
import { observer } from "mobx-react";
import { c } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";
import { useRef, useState } from "react";

const providers = [
	{
		name: "OpenAI",
		models: [
			{
				name: "GPT-4o",
				value: "gpt-4o",
			},
			{
				name: "GPT-4o-mini",
				value: "gpt-4o-mini",
			},
			{
				name: "GPT-3.5-turbo",
				value: "gpt-3.5-turbo",
			},
		],
	},
	{
		name: "Google",
		models: [
			{
				name: "Gemini 2.0 Flash",
				value: "gemini-2.0-flash",
			},
		],
	},
	{
		name: "Anthropic",
		models: [
			{
				name: "Claude 3.5 Sonnet",
				value: "claude-3-5-sonnet",
			},
		],
	},
];
export const ChatModelSelect = observer(function ChatModelSelect({
	ref,
	setModel,
}: {
	ref: React.RefObject<HTMLButtonElement | null>;
	setModel: (model: string) => void;
}) {
	const [value, setValue] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

	function handleSelect(value: string) {
		setValue(value);
		setModel(value);
		setOpen(false);
	}

	function getRenderingName(value: string) {
		const model = providers
			.flatMap((provider) => provider.models)
			.find((model) => model.value === value);
		return model?.name;
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger ref={ref} className="outline-none ring-0">
				<Button
					variant="ghost"
					size="sm"
					className="h-6 px-2 text-gray-700 outline-none ring-0"
				>
					<IconBrain className="size-4" />
					{value ? getRenderingName(value) : "Model"}
					<Shortcut shortcut={["M"]} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search model..." />
					<CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
						<CommandEmpty>No model found.</CommandEmpty>
						{providers.map((provider) => (
							<CommandGroup key={provider.name} heading={provider.name}>
								{provider.models.map((model) => (
									<CommandItem
										key={model.value}
										value={model.value}
										onSelect={() => handleSelect(model.value)}
									>
										{model.name}
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
export const ChatMCPSelect = observer(function ChatMCPSelect({
	ref,
	setMcp,
}: {
	ref: React.RefObject<HTMLButtonElement | null>;
	setMcp: (mcp: string) => void;
}) {
	const [value, setValue] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

	function handleSelect(value: string) {
		setValue(value);
		setMcp(value);
		setOpen(false);
	}

	function getRenderingName(value: string) {
		const item = mcpProviders
			.flatMap((provider) => provider.items)
			.find((item) => item.value === value);
		return item?.name;
	}
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger ref={ref} className="outline-none ring-0">
				<Button
					variant="ghost"
					size="sm"
					className="h-6 px-2 text-gray-700 outline-none ring-0"
				>
					<IconAssembly className="size-4" />
					{value ? getRenderingName(value) : "MCP"}
					<Shortcut shortcut={["S"]} nothen />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search MCP..." />
					<CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
						<CommandEmpty>No MCP found.</CommandEmpty>
						{mcpProviders.map((provider) => (
							<CommandGroup key={provider.category} heading={provider.category}>
								{provider.items.map((item) => (
									<CommandItem
										key={item.value}
										value={item.value}
										onSelect={() => handleSelect(item.value)}
									>
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
