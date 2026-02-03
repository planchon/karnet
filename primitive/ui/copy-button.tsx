"use client";

import { removeMarkdown } from "@excalidraw/markdown-to-text";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";
import { Button } from "@/primitive/ui/button";

type CopyButtonProps = {
    content: string;
    copyMessage?: string;
    convertMarkdown?: boolean;
};

export function CopyButton({ content, copyMessage, convertMarkdown = true }: CopyButtonProps) {
    const [isCopied, copy] = useCopyToClipboard();

    const handleCopy = () => {
        const textToCopy = convertMarkdown ? removeMarkdown(content) : content;
        copy(copyMessage || textToCopy);
    };

    return (
        <Button
            aria-label="Copy to clipboard"
            className="relative h-6 w-6"
            onClick={handleCopy}
            size="icon"
            variant="ghost"
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <Check className={cn("h-4 w-4 transition-transform ease-in-out", isCopied ? "scale-100" : "scale-0")} />
            </div>
            <Copy className={cn("h-4 w-4 transition-transform ease-in-out", isCopied ? "scale-0" : "scale-100")} />
        </Button>
    );
}
