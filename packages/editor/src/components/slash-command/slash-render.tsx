import { Editor, ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import { RefObject } from "react";
import tippy, { Instance, Props } from "tippy.js";
import { SlashComponent } from "./slash-component";

export const slashRenderItems: SuggestionOptions["render"] = (
  elementRef?: RefObject<Element> | null
) => {
  let popup: Instance<Props>[] | null = null;
  let component: ReactRenderer<typeof SlashComponent> | null = null;

  return {
    onStart: (props) => {
      const { editor, clientRect } = props;

      component = new ReactRenderer(SlashComponent, {
        props,
        editor
      });

      const { selection } = editor.state;
      const parentNode = selection.$from.node(selection.$from.depth);
      const blockType = parentNode.type.name;

      if (blockType === "codeBlock") {
        return false;
      }

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: clientRect,
        content: component.element,
        duration: 0,
        placement: "bottom-start",
        appendTo: () => elementRef?.current ?? document.body,
        interactive: true,
        showOnCreate: true,
        trigger: "manual"
      });
    },
    onUpdate: (props: any) => {
      component?.updateProps(props);
      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect
      });
    },
    onKeyDown: (props) => {
      console.log("onKeyDown", props.event);
      if (props.event.key === "Escape") {
        popup?.[0]?.hide();
        return true;
      }

      // @ts-ignore
      return component.ref?.onKeyDown(props.event);
    },
    onExit: () => {
      popup?.[0]?.destroy();
      component?.destroy();
    }
  };
};
