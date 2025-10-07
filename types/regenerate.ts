import type { useChat } from "@ai-sdk/react";
import type { KarnetModel } from "@/hooks/useModels";

export type Regenerate = (
    args: Parameters<ReturnType<typeof useChat>["regenerate"]>[0],
    overrideModel?: KarnetModel
) => void;
