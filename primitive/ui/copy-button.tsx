"use client";

import { removeMarkdown } from "@excalidraw/markdown-to-text";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { convertMarkdownToHtml } from "@/lib/markdown-to-html";
import { cn } from "@/lib/utils";
import { Button } from "@/primitive/ui/button";

type CopyButtonProps = {
    content: string;
    copyMessage?: string;
    convertMarkdown?: boolean;
};

export function CopyButton({ content, copyMessage, convertMarkdown = true }: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            const textToCopy = convertMarkdown ? removeMarkdown(content) : content;

            // Create clipboard items with HTML and plain text formats
            const htmlContent = await convertMarkdownToHtml(content);

            const clipboardItem = new ClipboardItem({
                "text/plain": new Blob([textToCopy], { type: "text/plain" }),
                "text/html": new Blob([htmlContent], { type: "text/html" }),
            });

            await navigator.clipboard.write([clipboardItem]);

            // Show success state
            setIsCopied(true);
            toast.success(copyMessage || "Copied to clipboard");

            // Reset after 1.5 seconds
            setTimeout(() => setIsCopied(false), 1500);
        } catch (error) {
            console.error("Failed to copy:", error);
            toast.error("Failed to copy to clipboard");
        }
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
