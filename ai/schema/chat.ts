import { z } from "zod";
import type { ChatUIMessage } from "@/components/ai/chat/chat.types";
import { OpenRouterModelSchema } from "./model";

export const bodySchema = z.object({
    messages: z.array(z.any()).transform((messages) => messages as ChatUIMessage[]),
    chatId: z.string(),
    streamId: z.string(),
    tools: z.array(z.union([z.literal("web"), z.literal("image"), z.literal("ocr")])),
    model: OpenRouterModelSchema,
});

export type ChatMessageBody = z.infer<typeof bodySchema>;
