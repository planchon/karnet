import { NextResponse } from "next/server";
import { z } from "zod";
import { OpenRouterModelSchema } from "../../../ai/schema/model";

const allModelsSchema = z.array(OpenRouterModelSchema);

const allowedProviders = [
    "anthropic",
    "vercel",
    "azure",
    "openai",
    "google",
    "vertex",
    "x-ai",
    "z-ai",
    "perplexity",
    "mistralai",
];

export async function GET() {
    const models = await fetch("https://openrouter.ai/api/v1/models");
    const data = await models.json();
    const allModels = allModelsSchema.safeParse(data.data);

    if (!allModels.success) {
        console.error(allModels.error);
        return new Response("Invalid models", { status: 500 });
    }

    const filteredModels = allModels.data
        .filter((model) => allowedProviders.includes(model.provider))
        .sort((a, b) => b.created - a.created);

    return NextResponse.json(filteredModels);
}
