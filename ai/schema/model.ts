import { z } from "zod";

export const InputModalitiesSchema = z.enum(["text", "image", "audio", "file"]);

export type InputModalities = z.infer<typeof InputModalitiesSchema>;

// Define the schema for the 'architecture' object
export const ArchitectureSchema = z.object({
    input_modalities: z.array(InputModalitiesSchema), // Assuming a fixed set of modalities
    output_modalities: z.array(z.enum(["text", "image"])), // Assuming a fixed set of modalities
    tokenizer: z.string(),
    instruct_type: z.string().nullish(),
});

// Define the schema for the 'top_provider' object
const TopProviderSchema = z.object({
    is_moderated: z.boolean(),
    context_length: z.number().nullish(), // Context length should be a positive integer
    max_completion_tokens: z.number().nullish(), // Max completion tokens should be a positive integer
});

// Define the schema for the 'pricing' object
const PricingSchema = z.object({
    // Using z.string() for currency values that might be "0" or decimals
    // If you want stricter numeric validation, you could use z.number() and adjust your data.
    // For now, mirroring the string representation from your JSON.
    prompt: z.coerce.number(),
    completion: z.coerce
        .number()
        .optional()
        .transform((val) => (val === 0 ? undefined : val)),
    image: z.coerce
        .number()
        .optional()
        .transform((val) => (val === 0 ? undefined : val)),
    request: z.coerce
        .number()
        .optional()
        .transform((val) => (val === 0 ? undefined : val)),
    web_search: z.coerce
        .number()
        .optional()
        .transform((val) => (val === 0 ? undefined : val)),
    internal_reasoning: z.coerce
        .number()
        .optional()
        .transform((val) => (val === 0 ? undefined : val)),
    input_cache_read: z.coerce
        .number()
        .nullish()
        .transform((val) => (val === 0 ? undefined : val)),
    input_cache_write: z.coerce
        .number()
        .nullish()
        .transform((val) => (val === 0 ? undefined : val)),
});

// Define the schema for the 'default_parameters' object
const DefaultParametersSchema = z.object({
    temperature: z.number().min(0).max(1).nullish(), // Temperature typically ranges from 0 to 1
    top_p: z.number().min(0).max(1).nullish(), // Top P typically ranges from 0 to 1
    frequency_penalty: z.number().nullish(), // Could be negative, zero, or positive depending on specifics
});

// Define the main schema for the entire object
const OpenRouterModelSchema = z
    .object({
        id: z.string(),
        name: z.string().transform((val) => {
            const data = val.split(":");
            if (data.length === 2) {
                return data[1];
            }
            return val;
        }),
        created: z.number().int().positive(), // Unix timestamp, so an integer
        description: z.string().optional(),
        architecture: ArchitectureSchema,
        top_provider: TopProviderSchema,
        pricing: PricingSchema,
        canonical_slug: z.string().nullish(),
        context_length: z.number().nullish(),
        hugging_face_id: z.string().nullish(),
        per_request_limits: z.record(z.string(), z.any()).nullish(), // Assuming an object with arbitrary keys/values, and optional
        supported_parameters: z.array(z.string()).nullish(),
        default_parameters: DefaultParametersSchema.nullish(),
    })
    .transform((data) => ({
        ...data,
        provider: data.id.split("/")[0],
    }));

// Export the schema for use
export type OpenRouterModel = z.infer<typeof OpenRouterModelSchema>;
export { OpenRouterModelSchema };

export function isImageGeneratingModel(model: OpenRouterModel | null | undefined) {
    if (!model) {
        return false;
    }

    return model.architecture.output_modalities.includes("image");
}
