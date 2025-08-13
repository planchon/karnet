import { IconSend } from '@tabler/icons-react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import { Button } from '@ui/button';
import { Shortcut } from '@ui/shortcut';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Chat } from '@/components/chat';
import { RewriteEnter } from '@/components/chat/extensions/enter';
import { MultipleTextualCommands } from '@/components/chat/extensions/textual-commands';
import { ComputerMessage } from '@/components/messages/computer-message.comp';
import { UserMessage } from '@/components/messages/user-message.comp';
import { messages as messagesMock } from '@/mocks/messages';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const ChatPage = observer(function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(messagesMock);
  const modelRef = React.useRef<HTMLButtonElement>(null);
  const mcpRef = React.useRef<HTMLButtonElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const [model, setModel] = useState<string | null>(null);
  const [mcp, setMcp] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document.configure({
        HTMLAttributes: {
          class: 'text-sm!',
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'min-h-[1rem] mt-0',
          // the tailwind text-sm! is not working here
          style: 'font-size: 13px;',
        },
      }),
      Text.configure({
        HTMLAttributes: {
          class: 'text-sm! min-h-[1rem]',
        },
      }),
      Placeholder.configure({
        placeholder: 'use / for commands and @ for entities',
        emptyNodeClass:
          'placeholder:text-[13px] placeholder:min-h-[1rem] placeholder:mt-0 text-sm!',
      }),
      MultipleTextualCommands,
      RewriteEnter,
    ],
    autofocus: 'start',
    content: '',
    editorProps: {
      attributes: {
        style: 'font-size: 13px;',
      },
    },
    onUpdate: ({ editor: e }) => {
      const text = e.getText();
      console.log(text);
    },
  });

  React.useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (!editor) return;
        editor.commands.blur();
      }

      if (['/', 't', ' '].includes(e.key)) {
        e.preventDefault();
        if (!editor) return;
        editor.commands.focus();
      }
    });
  }, [editor]);

  const modelMCPHandler = (e: KeyboardEvent) => {
    if (editor?.isFocused) {
      return;
    }

    if (e.key === 'm') {
      console.log('open model');
      modelRef.current?.click();
      e.preventDefault();
      return;
    }

    if (e.key === 's') {
      console.log('open mcp');
      mcpRef.current?.click();
      e.preventDefault();
      return;
    }

    if (e.key === 'g' || e.key === 'c') {
      return;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: mcp change every render
  React.useEffect(() => {
    document.addEventListener('keydown', modelMCPHandler);

    return () => {
      document.removeEventListener('keydown', modelMCPHandler);
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="scrollbar-thin flex justify-center overflow-y-auto">
        <div className="h-auto w-9/12 max-w-[900px] space-y-8 pt-12">
          {messages.map((message) => (
            <div key={message.id}>
              {message.sender === 'user' ? (
                <UserMessage content={message.content} />
              ) : (
                <ComputerMessage content={message.content} />
              )}
            </div>
          ))}
          <div className="h-[100px]" ref={messagesEndRef} />
        </div>
      </div>
      <div className="absolute bottom-0 flex h-auto w-full items-center justify-center">
        <div className="h-full w-9/12 max-w-[900px]">
          <Chat.Root>
            <div className="h-full w-full p-2">
              <EditorContent className="w-full text-sm!" editor={editor} />
            </div>
            <div className="flex w-full justify-between p-2 py-0 pl-1">
              <div className="flex items-center gap-0">
                <Chat.ModelSelect ref={modelRef} setModel={setModel} />
                <Chat.MCPSelect ref={mcpRef} setMcp={setMcp} />
              </div>
              <div className="pb-2">
                <Button className="h-8 rounded-sm pr-[6px]! pl-[8px]!">
                  <IconSend className="size-4" />
                  Send
                  <Shortcut nothen shortcut={['⌘', '↵']} />
                </Button>
              </div>
            </div>
          </Chat.Root>
        </div>
      </div>
    </div>
  );
});
