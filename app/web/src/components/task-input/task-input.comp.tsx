import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { TextStyleKit } from '@tiptap/extension-text-style';

import { EditorContent, useEditor } from '@tiptap/react';

export function TaskInputComp() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [Document, Paragraph, Text, TextStyleKit],
    autofocus: 'start',
    content: 'je suis un test <span class-name="text-red-500">red</span>',
  });

  return <EditorContent className="w-full" editor={editor} />;
}
