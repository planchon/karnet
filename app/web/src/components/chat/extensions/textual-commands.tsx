import Mention, { type MentionOptions } from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import type { SuggestionOptions } from "@tiptap/suggestion";
import tippy, {
	type Instance,
	type Props,
} from "tippy.js";
import { ModelSuggestionComponent } from "./model-suggestion";
import { ToolsSuggestionComponent } from "./tools-suggestion";

const renderItems: SuggestionOptions["render"] = () => {
	let component: ReactRenderer | null = null;
	let popup: Instance<Props>[] | null = null;

	return {
		onStart: (props) => {
      const { editor } = props;

      if (props.text === "/") {
        component = new ReactRenderer(ToolsSuggestionComponent, {
          editor: editor,
          props,
        });
      }
      if (props.text === "@") {
        component = new ReactRenderer(ModelSuggestionComponent, {
          editor: editor,
          props,
        });
      }

      if (!component) {
        console.error("No component found");
        return;
      }

      // add the context menu to the editor
      // it also position it to the correct place (next to the cursor)
			// @ts-ignore
			popup = tippy("body", {
				getReferenceClientRect: props.clientRect,
				appendTo: () => document.body,
				content: component.element,
				showOnCreate: true,
				interactive: true,
				trigger: "manual",
				placement: "bottom-start",
			});
		},
		onUpdate: (props) => {
			component?.updateProps(props);
			popup?.[0]?.setProps({
				// @ts-ignore
				getReferenceClientRect: props.clientRect,
			});
		},
		onKeyDown: (props) => {
			if (props.event.key === "Escape") {
				popup?.[0]?.hide();

				return true;
			}

      console.log("key down", props)

			// @ts-ignore
			return component?.ref?.onKeyDown(props);
		},
		onExit: () => {
			popup?.[0]?.destroy();
			component?.destroy();
		},
	};
};

export const MultipleTextualCommands = Mention.configure({
	suggestions: [
		{
			char: "/",
			render: renderItems,
		},
		{
			char: "@",
			render: renderItems,
		},
	],
});
