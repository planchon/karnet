import { Mark, ReactMarkViewRenderer } from '@tiptap/react';

export const PriorityComponent = () => {
  return <span className="text-red-500">Priority</span>;
};

export const PriorityMark = Mark.create({
  name: 'priority',

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
        tag: 'priority',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['priority', HTMLAttributes];
  },
});
