import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	gateway,
	streamText,
} from "ai";
import { getAvailableModels } from "@/ai/gateway";
import type { ChatUIMessage } from "@/components/chat/chat.types";
import basePrompt from "./base_prompt.md";

interface BodyData {
	messages: ChatUIMessage[];
	modelId?: string;
	reasoningEffort?: "low" | "medium";
}

export async function POST(req: Request) {
	console.log("Chat API called");

	const [models, { messages, modelId }] = await Promise.all([
		getAvailableModels(),
		req.json() as Promise<BodyData>,
	]);

	const model = models.find((m) => m.id === modelId);
	if (!model) {
		return new Response("Model not found", { status: 404 });
	}

	return createUIMessageStreamResponse({
		stream: createUIMessageStream({
			originalMessages: messages,
			execute: async ({ writer }) => {
				const res = streamText({
					model: gateway(model.id),
					system: basePrompt,
					messages: convertToModelMessages(messages),
				});

				res.consumeStream();
				writer.merge(
					res.toUIMessageStream({
						sendReasoning: true,
						sendStart: false,
						messageMetadata: () => ({
							model: model.name,
						}),
					}),
				);
			},
		}),
	});
}
