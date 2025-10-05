import type { GatewayLanguageModelEntry } from "@ai-sdk/gateway";
import {
    Alibaba,
    Anthropic,
    Azure,
    Baseten,
    Bedrock,
    Cohere,
    DeepInfra,
    DeepSeek,
    Fireworks,
    Google,
    Groq,
    Mistral,
    Novita,
    OpenAI,
    Parasail,
    Perplexity,
    Vercel,
    VertexAI,
    Voyage,
    XAI,
    ZAI,
} from "@lobehub/icons";
import { IconBrain } from "@tabler/icons-react";
import type { HTMLAttributes } from "react";

export const providerIcons = {
    alibaba: Alibaba,
    anthropic: Anthropic,
    azure: Azure,
    bedrock: Bedrock,
    cohere: Cohere,
    deepseek: DeepSeek,
    google: Google,
    groq: Groq,
    mistral: Mistral,
    openai: OpenAI,
    perplexity: Perplexity,
    vercel: Vercel,
    vertex: VertexAI,
    "x-ai": XAI,
    "z-ai": ZAI,
};

export type Provider = keyof typeof providerIcons;

export const ProviderIcons = ({ provider, ...props }: { provider: string } & HTMLAttributes<HTMLDivElement>) => {
    // @ts-expect-error
    const Icon = providerIcons[provider];
    if (!Icon) {
        return <IconBrain className={props.className} />;
    }
    return <Icon {...props} />;
};

export type GeneralKarnetModel = {
    name: string;
    id: string;
    description: string;
    provider: Provider;
    metadata?: {
        ai: {
            context: string;
            max_output: string;
        };
        cost: {
            input: number;
            output: number;
            cache_read: number;
            cache_write: number;
        };
    };
};

export const supportedModels: GeneralKarnetModel[] = [
    // google models
    {
        id: "x-ai/grok-4-fast",
        name: "xAI: Grok 4 Fast",
        provider: "xai",
    },
    {
        name: "Gemini 2.5 Flash",
        id: "google/gemini-2.5-flash",
        provider: "google",
    },
    {
        name: "Gemini 2.5 Lite",
        id: "google/gemini-2.5-flash-lite",
        provider: "google",
    },
    {
        id: "x-ai/grok-code-fast-1",
        name: "xAI: Grok Code Fast",
        provider: "xai",
    },
    {
        id: "z-ai/glm-4.6",
        name: "Z-AI: GLM 4.6",
        provider: "zai",
    },
    {
        id: "google/gemini-2.5-pro",
        name: "Google: Gemini 2.5 Pro",
        provider: "google",
    },
    // xai models
    {
        id: "x-ai/grok-4",
        name: "xAI: Grok 4",
        provider: "xai",
    },
    // open ai
    {
        id: "openai/gpt-5-chat",
        name: "OpenAI: GPT-5 Chat",
        provider: "openai",
    },
    {
        id: "openai/gpt-5-mini",
        name: "OpenAI: GPT-5 Mini",
        provider: "openai",
    },
    {
        id: "openai/gpt-5-nano",
        name: "OpenAI: GPT-5 Nano",
        provider: "openai",
    },
    // search
    {
        id: "perplexity/sonar",
        name: "Perplexity: Sonar",
        provider: "perplexity",
    },
];

export const defaultModel: GeneralKarnetModel = supportedModels.find(
    (m) => m.id === "google/gemini-2.5-flash"
) as GeneralKarnetModel;

export const groupedByProvider = supportedModels.reduce(
    (acc, model) => {
        acc[model.provider] = acc[model.provider] || [];
        acc[model.provider].push(model);
        return acc;
    },
    {} as Record<Provider, GeneralKarnetModel[]>
);
