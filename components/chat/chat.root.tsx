"use client";

import { observer } from "mobx-react";
import type React from "react";
import { cn } from "@/lib/utils";

type ChatRootProps = React.ComponentProps<"div">;

export const ChatRoot = observer(function ChatRootInside({ children, className, ...props }: ChatRootProps) {
    return (
        <div className={cn(className)} {...props}>
            {children}
        </div>
    );
});
