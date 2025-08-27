import { IconSend } from '@tabler/icons-react';
import { Button } from '@ui/button';
import { Shortcut } from '@ui/shortcut';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Chat } from '@/components/chat';
import { ComputerMessage } from '@/components/messages/computer-message.comp';
import { UserMessage } from '@/components/messages/user-message.comp';
import { messages as messagesMock } from '@/mocks/messages';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const ChatPage = observer(function ChatPageInner() {
  const [messages] = useState<Message[]>(messagesMock);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

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
              <Chat.Input />
            </div>
            <div className="flex w-full justify-between p-2 py-0 pl-1">
              <div className="flex items-center gap-0">
                <Chat.ModelSelect />
                <Chat.MCPSelect />
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
