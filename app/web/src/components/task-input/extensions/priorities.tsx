import { InputRule, mergeAttributes, Node } from "@tiptap/core";

const regex = /(^|\s)p(\d+)$/;

export const PriorityNode = Node.create({
	name: "priority",
	inline: true,
	group: "inline",
	selectable: false,

	addAttributes() {
		return {
			level: {
				default: 1,
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: "span[data-priority]",
			},
		];
	},

	renderHTML({ node, HTMLAttributes }) {
		const level = parseInt(node.attrs.level || "1");

		let color = "";

		switch (level) {
			case 0:
				color = "bg-stone-500/80";
				break;
			case 1:
				color = "bg-red-500/80";
				break;
			case 2:
				color = "bg-yellow-500/80";
				break;
			case 3:
				color = "bg-green-500/80";
				break;
			default:
				color = "bg-gray-200/80";
		}

		const attributes = mergeAttributes(
			this.options.HTMLAttributes,
			HTMLAttributes,
			{
				level: 1,
				class: `font-normal px-[3px] pb-[2px] py-[1px] ${color} rounded-xs`,
			},
		);

		return ["span", attributes, `p${node.attrs.level}`];
	},

	renderText({ node }) {
		return `p${node.attrs.level}`;
	},

	addInputRules() {
		const rules: InputRule[] = [];

		rules.push(
			new InputRule({
				find: regex,
				handler: ({ range, match, chain }) => {
					const [, , level] = match;

					console.log(range, match);

					chain()
						.insertContentAt(range, {
							type: this.name,
							attrs: {
								level,
							},
						})
						.run();
				},
			}),
		);

		return rules;
	},
});
