import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance, type Props } from 'tippy.js';

export const renderItems = (
  RenderingComponent: any,
  callback: (props: { id: string }) => void
) => {
  let component: ReactRenderer | null = null;
  let popup: Instance<Props>[] | null = null;

  return {
    // @ts-expect-error
    onStart: (props) => {
      const { editor } = props;

      props.callback = callback;

      component = new ReactRenderer(RenderingComponent, {
        editor,
        props,
      });

      if (!component) {
        console.error('No component found');
        return;
      }

      // add the context menu to the editor
      // it also position it to the correct place (next to the cursor)
      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },
    // @ts-expect-error
    onUpdate: (props) => {
      component?.updateProps(props);
      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    // @ts-expect-error
    onKeyDown: (props) => {
      if (props.event.key === 'Escape') {
        popup?.[0]?.hide();

        return true;
      }

      // @ts-expect-error
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
};
