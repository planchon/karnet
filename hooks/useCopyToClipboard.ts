import { useCallback, useState } from "react";
import { toast } from "sonner";

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
            await navigator.clipboard.writeText(text);
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
