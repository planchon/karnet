"use client";

import { observer } from "mobx-react";
import React, { createContext } from "react";
import { cn } from "@/lib/utils";

type ChatRootProps = React.ComponentProps<"div">;

export const ChatContext = createContext<{
    modelRef: React.RefObject<HTMLButtonElement | null>;
    mcpRef: React.RefObject<HTMLButtonElement | null>;
}>({
    modelRef: {
        current: null,
    },
    mcpRef: {
        current: null,
    },
});

export const ChatRoot = observer(function ChatRootInside({ children, className, ...props }: ChatRootProps) {
    const modelRef = React.useRef<HTMLButtonElement>(null);
    const mcpRef = React.useRef<HTMLButtonElement>(null);

    return (
        <ChatContext.Provider value={{ modelRef, mcpRef }}>
            <div className={cn(className)} {...props}>
                {children}
            </div>
        </ChatContext.Provider>
    );
});
