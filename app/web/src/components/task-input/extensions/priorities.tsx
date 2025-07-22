import { InputRule, mergeAttributes, Node } from '@tiptap/core';
import { createOnNodeDeletePlugin } from './node-delete';

const regex = /(^|\s)p(\d+)$/;

type PriorityNodeOptions = {
  onPriorityChange: (value: string) => void;
  onNodeDelete?: () => void;
};

export const PriorityNode = Node.create<PriorityNodeOptions>({
  name: 'priority',
  inline: true,
  group: 'inline',
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
        tag: 'span[data-priority]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = Number.parseInt(node.attrs.level || '1', 10);

    let color = '';

    switch (level) {
      case 0:
        color = 'bg-stone-200';
        break;
      case 1:
        color = 'bg-red-200';
        break;
      case 2:
        color = 'bg-yellow-200';
        break;
      case 3:
        color = 'bg-green-200';
        break;
      default:
        color = 'bg-gray-200';
    }

    const attributes = mergeAttributes(
      // @ts-expect-error
      this.options.HTMLAttributes,
      HTMLAttributes,
      {
        level: 1,
        class: `font-normal px-[3px] pb-[2px] py-[1px] ml-1 ${color} rounded-xs`,
      }
    );

    return ['span', attributes, `p${level}`];
  },

  renderText({ node }) {
    const level = Number.parseInt(node.attrs.level || '1', 10);
    return ` p${level}`;
  },

  addInputRules() {
    const rules: InputRule[] = [];

    rules.push(
      new InputRule({
        find: regex,
        handler: ({ range, match, chain, state }) => {
          const [, , level] = match;

          let deleted = false;

          state.doc.descendants((node, pos) => {
            if (node.type.name === this.name) {
              deleted = true;
              chain()
                .deleteRange({
                  from: pos,
                  to: pos + node.nodeSize,
                })
                .run();
            }
          });

          let newRange = range;

          if (deleted) {
            newRange = {
              from: range.from - 1,
              to: range.to,
            };
          }

          chain()
            .insertContentAt(newRange, {
              type: this.name,
              attrs: {
                level,
              },
            })
            .run();

          if (level) {
            this.options.onPriorityChange(level);
          }
        },
      })
    );

    return rules;
  },

  addProseMirrorPlugins() {
    return [createOnNodeDeletePlugin(this.name, this.options.onNodeDelete)];
  },
});
