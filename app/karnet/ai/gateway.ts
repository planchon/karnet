import { createGatewayProvider } from "@ai-sdk/gateway";

export async function getAvailableModels() {
	const gateway = getGateway();
	const models = await gateway.getAvailableModels();
	return models.models;
}

function getGateway() {
	const apiKey = process.env.AI_GATEWAY_API_KEY;
	if (!apiKey) {
		throw new Error("AI_GATEWAY_API_KEY is not set");
	}

	return createGatewayProvider({
		baseURL: process.env.AI_GATEWAY_BASE_URL,
		apiKey: process.env.AI_GATEWAY_API_KEY,
	});
}
