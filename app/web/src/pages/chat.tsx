import { useState } from "react";
import { observer } from "mobx-react";

import { messages as messagesMock } from "@/mocks/messages";
import { UserMessage } from "@/components/messages/user-message.comp";
import { ComputerMessage } from "@/components/messages/computer-message.comp";
import { Chat } from "@/components/chat";
import { Button } from "@ui/button";
import { SendIcon } from "lucide-react";
import { Shortcut } from "@ui/shortcut";
import {
  IconAssembly,
  IconGlobe,
  IconSend,
  IconWebhook,
  IconWorldWww
} from "@tabler/icons-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export const ChatPage = observer(function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(messagesMock);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-8 pb-24">
          {messages.map((message) => (
            <div key={message.id}>
              {message.sender === "user" ? (
                <UserMessage content={message.content} />
              ) : (
                <ComputerMessage content={message.content} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 flex h-auto w-full items-center justify-center">
        <div className="h-full w-1/2">
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
                <Button className="h-8 rounded-sm px-2">
                  <IconSend className="size-4" />
                  Send
                  <Shortcut shortcut={["⌘", "↵"]} nothen />
                </Button>
              </div>
            </div>
          </Chat.Root>
        </div>
      </div>
    </div>
  );
});
