import React, { useState } from "react";
import { MessageInput } from "@/primitive/ui/message-input";
import { ChatInput } from "@/components/chat/chat-input";
import { observer } from "mobx-react";

import { messages as messagesMock } from "@/mocks/messages";
import { UserMessage } from "@/components/messages/user-message.comp";
import { ComputerMessage } from "@/components/messages/computer-message.comp";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export const ChatPage = observer(function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(messagesMock);

  const handleSubmit = (message: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessage]);
    // TODO: Handle AI response
  };

  const handleModelChange = () => {
    // TODO: Implement model selection
    console.log("Model change requested");
  };

  const handleSearchToggle = () => {
    // TODO: Implement search toggle
    console.log("Search toggle requested");
  };

  const handleFileAttach = (files: FileList) => {
    // TODO: Implement file attachment
    console.log("Files attached:", files);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-8">
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
      <ChatInput />
    </div>
  );
});
