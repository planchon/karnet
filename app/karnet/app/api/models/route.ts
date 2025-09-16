import { NextResponse } from "next/server";
import { getAvailableModels } from "@/ai/gateway";

export async function GET(req: Request) {
	const models = await getAvailableModels();
	return NextResponse.json(models);
}
