import { mergeAttributes, Node } from '@tiptap/core';

export const ModelNode = Node.create({
  name: 'model',
  inline: true,
  group: 'inline',
  selectable: false,

  addAttributes() {
    return {
      model: {
        default: 'gpt-4o',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-model]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const model = node.attrs.model;

    const attributes = mergeAttributes(
      // @ts-expect-error
      this.options.HTMLAttributes,
      HTMLAttributes,
      {
        model: model,
        class: `font-normal px-[3px] pb-[2px] py-[1px] ml-1 border border-gray-200 bg-gray-100 rounded-xs`,
      }
    );

    return ['span', attributes, `${model}`];
  },

  renderText({ node }) {
    const model = node.attrs.model;
    return `${model}`;
  },
});