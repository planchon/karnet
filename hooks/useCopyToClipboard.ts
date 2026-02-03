import { removeMarkdown } from "@excalidraw/markdown-to-text";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { convertMarkdownToHtml } from "@/lib/markdown-to-html";

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);

    const copy: CopyFn = useCallback(async (text) => {
        if (!navigator?.clipboard) {
            console.warn("Clipboard not supported");
            return false;
        }

        // Try to save to clipboard then save it in the state if worked
        try {
            // Convert markdown to plain text for text/plain format
            const textToCopy = removeMarkdown(text);

            // Create clipboard items with HTML and plain text formats
            const htmlContent = await convertMarkdownToHtml(text);

            const clipboardItem = new ClipboardItem({
                "text/plain": new Blob([textToCopy], { type: "text/plain" }),
                "text/html": new Blob([htmlContent], { type: "text/html" }),
            });

            await navigator.clipboard.write([clipboardItem]);

            setCopiedText(text);
            toast.success("Copied to clipboard");
            setTimeout(() => {
                setCopiedText(null);
            }, 1500);
            return true;
        } catch {
            toast.warning("Your browser does not support copying to clipboard");
            setCopiedText(null);
            return false;
        }
    }, []);

    return [copiedText, copy];
}
