import type { Editor, Range } from "@tiptap/react";
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiAnthropicFill } from "react-icons/ri";

export const modelSuggestion = [
	{
		group: "OpenAI",
		items: [
			{
				title: "GPT 4o",
				searchTerms: ["gpt-4o"],
				icon: AiOutlineOpenAI,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("gpt-4o");
				},
			},
			{
				title: "GPT 4o Mini",
				searchTerms: ["gpt-4o-mini"],
				icon: AiOutlineOpenAI,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("gpt-4o-mini");
				},
			},
			{
				title: "GPT 5",
				searchTerms: ["gpt-5"],
				icon: AiOutlineOpenAI,
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
				icon: RiAnthropicFill,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("claude-3-5-sonnet-20240620");
				},
			},
			{
				title: "Claude 4 Opus",
				searchTerms: ["claude 4 opus"],
				icon: RiAnthropicFill,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("claude-4-opus");
				},
			},
			{
				title: "Claude 4.1 Opus",
				searchTerms: ["claude 4.1 opus"],
				icon: RiAnthropicFill,
				command: ({ editor, range }: { editor: Editor; range: Range }) => {
					editor.chain().focus().deleteRange(range).run();
					alert("claude-4.1-opus");
				},
			},
		],
	},
];
