import React, { useState } from "react";
import { MessageInput } from "@/components/ui/message-input";
import { ChatInput } from "@/components/chat/chat-input";
import { observer } from "mobx-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export const ChatPage = observer(function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

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
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-[rgb(162,59,103)] text-white"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <ChatInput />
    </div>
  );
});
