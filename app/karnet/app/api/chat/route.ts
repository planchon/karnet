import { auth, clerkClient } from "@clerk/nextjs/server";
import { convertToModelMessages, gateway, generateId, streamText } from "ai";
import { fetchMutation } from "convex/nextjs";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { getAvailableModels } from "@/ai/gateway";
import type { ChatUIMessage } from "@/components/chat/chat.types";
import { api } from "@/convex/_generated/api";
import basePrompt from "./base_prompt.md";

interface BodyData {
	messages: ChatUIMessage[];
	modelId?: string;
	reasoningEffort?: "low" | "medium";
	chatId?: string;
}

export async function POST(req: Request) {
	console.log("Chat API called");

	// extract clerk jwt token
	const { sessionId } = await auth();
	if (!sessionId) {
		return new Response("Unauthorized", { status: 401 });
	}
	const tokenRes = await (await clerkClient()).sessions.getToken(
		sessionId,
		"convex",
	);
	if (!tokenRes) {
		return new Response("Unauthorized", { status: 401 });
	}

	const [models, { messages, modelId }] = await Promise.all([
		getAvailableModels(),
		req.json() as Promise<BodyData>,
	]);

	const model = models.find((m) => m.id === modelId);
	if (!model) {
		return new Response("Model not found", { status: 404 });
	}

	const userInputMessage = messages
		.filter((m) => m.role === "user")[0]
		.parts.find((p) => p.type === "text")?.text;

	if (!userInputMessage) {
		throw new Error("User input message not found");
	}

	const streamId = generateId();

	// this will create the new chat id we need
	const chat = await fetchMutation(
		api.functions.chat.createEmptyChat,
		{
			model: {
				id: model.id,
				name: model.name,
				provider: model.specification.provider,
			},
			streamId: streamId,
			userInputMessage: userInputMessage,
		},
		{
			token: tokenRes.jwt,
		},
	);

	const res = streamText({
		model: gateway(model.id),
		system: basePrompt,
		messages: convertToModelMessages(messages),
	});

	return res.toUIMessageStreamResponse({
		originalMessages: messages,
		generateMessageId: generateId,
		messageMetadata: () => ({
			model: model.name,
		}),
		onFinish: async (message) => {
			console.log("Chat API finished", message);

			await fetchMutation(
				api.functions.chat.updateChatStream,
				{
					id: chat._id,
					stream: {
						status: "inactive",
					},
				},
				{
					token: tokenRes.jwt,
				},
			);
		},
		async consumeSseStream({ stream }) {
			const streamContext = createResumableStreamContext({
				waitUntil: after,
			});

			await streamContext.createNewResumableStream(streamId, () => stream);

			// change the stream status to active
			await fetchMutation(
				api.functions.chat.updateChatStream,
				{
					id: chat._id,
					stream: {
						status: "active",
						id: streamId,
					},
				},
				{
					token: tokenRes.jwt,
				},
			);
		},
	});
}
