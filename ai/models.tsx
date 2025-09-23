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
    baseten: Baseten,
    bedrock: Bedrock,
    cohere: Cohere,
    deepinfra: DeepInfra,
    deepseek: DeepSeek,
    fireworks: Fireworks,
    google: Google,
    groq: Groq,
    mistral: Mistral,
    novita: Novita,
    openai: OpenAI,
    parasail: Parasail,
    perplexity: Perplexity,
    vercel: Vercel,
    vertex: VertexAI,
    voyage: Voyage,
    xai: XAI,
    zai: ZAI,
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
    provider: Provider;
};

export const supportedModels: GeneralKarnetModel[] = [
    // google models
    {
        name: "Gemini 2.5 Lite",
        id: "google/gemini-2.5-flash-lite",
        provider: "google",
    },
    {
        name: "Gemini 2.5 Flash",
        id: "google/gemini-2.5-flash",
        provider: "google",
    },
    {
        id: "google/gemini-2.5-pro",
        name: "Google: Gemini 2.5 Pro",
        provider: "google",
    },
    // xai models
    {
        id: "x-ai/grok-3-mini",
        name: "xAI: Grok 3 Mini",
        provider: "xai",
    },
    {
        id: "x-ai/grok-3",
        name: "xAI: Grok 3",
        provider: "xai",
    },
    {
        id: "x-ai/grok-4",
        name: "xAI: Grok 4",
        provider: "xai",
    },
    {
        id: "x-ai/grok-code-fast-1",
        name: "xAI: Grok Code Fast",
        provider: "xai",
    },
    {
        id: "x-ai/grok-4-fast:free",
        name: "xAI: Grok 4 Fast free",
        provider: "xai",
    },
    {
        id: "x-ai/grok-4-fast",
        name: "xAI: Grok 4 Fast",
        provider: "xai",
    },
    // open ai
    {
        id: "openai/o4-mini-high",
        name: "OpenAI: o4 Mini High",
        provider: "openai",
    },
    {
        id: "openai/o4-mini",
        name: "OpenAI: o4 Mini High",
        provider: "openai",
    },
    {
        id: "openai/o3-mini-high",
        name: "OpenAI: o3 Mini High",
        provider: "openai",
    },
    {
        id: "openai/o3",
        name: "OpenAI: o3",
        provider: "openai",
    },
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
