import { useRef, useState } from "react";

import { MessageInput } from "@/primitive/ui/message-input";
import { ChatForm } from "@/primitive/ui/chat";

export function ChatInput() {
  const [value, setValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const timeout = useRef<number | null>(null);

  const cancelTimeout = () => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
  };

  const setNewTimeout = (callback: () => void, ms: number) => {
    cancelTimeout();
    const id = window.setTimeout(callback, ms);
    timeout.current = id;
  };

  return (
    <div className="absolute bottom-0 z-[100] flex w-full justify-center">
      <ChatForm
        className="w-full max-w-[750px]"
        isPending={false}
        handleSubmit={(event) => {
          event?.preventDefault?.();
          setValue("");
          setIsGenerating(true);
          setNewTimeout(() => {
            setIsGenerating(false);
          }, 2000);
        }}
      >
        {({ files, setFiles }) => (
          <MessageInput
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            placeholder="Type your message here..."
            allowAttachments
            files={files}
            setFiles={setFiles}
            stop={() => {
              setIsGenerating(false);
              cancelTimeout();
            }}
            isGenerating={isGenerating}
          />
        )}
      </ChatForm>
    </div>
  );
}
