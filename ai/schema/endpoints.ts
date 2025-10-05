import { z } from "zod";
import { ArchitectureSchema } from "./model";

export const EndpointPricingSchema = z.object({
    request: z.string(),
    image: z.string(),
    prompt: z.string(),
    completion: z.string(),
});

export const EndpointSchema = z.object({
    name: z.string(),
    context_length: z.number(),
    pricing: EndpointPricingSchema,
    provider_name: z.string(),
    supported_parameters: z.array(z.string()),
    quantization: z.string(),
    max_completion_tokens: z.number(),
    max_prompt_tokens: z.number(),
    status: z.string(),
    uptime_last_30m: z.number(),
});

export const OpenRouterEndpointsSchema = z.object({
    id: z.string(),
    name: z.string(),
    created: z.number(),
    description: z.string(),
    architecture: ArchitectureSchema,
    endpoints: z.array(EndpointSchema),
});
