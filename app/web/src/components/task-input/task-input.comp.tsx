import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import { EditorContent, Node, useEditor } from '@tiptap/react';
import { DeadlineNode } from './extensions/deadline';
import { PriorityNode } from './extensions/priorities';

export function TaskInputComp({
  onDeadlineChange,
  onPriorityChange,
  onValueChange,
}: {
  onDeadlineChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onValueChange: (value: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Node.create({
        name: 'oneLine',
        topNode: true,
        content: 'block',
      }),
      Paragraph,
      Text,
      PriorityNode.configure({
        onPriorityChange,
      }),
      DeadlineNode.configure({
        onDeadlineChange,
      }),
    ],
    autofocus: 'start',
    content: '',
    onUpdate: ({ editor: e }) => {
      const text = e.getText();
      onValueChange(text);
    },
  });

  return <EditorContent className="w-full" editor={editor} />;
}
