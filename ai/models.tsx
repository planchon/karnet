import {
    Alibaba,
    Anthropic,
    Azure,
    Bedrock,
    Cohere,
    DeepSeek,
    Google,
    Groq,
    Mistral,
    OpenAI,
    Perplexity,
    Vercel,
    VertexAI,
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

export const providerNames = {
    alibaba: "Alibaba",
    anthropic: "Anthropic",
    azure: "Azure",
    bedrock: "Bedrock",
    cohere: "Cohere",
    deepseek: "DeepSeek",
    google: "Google",
    groq: "Groq",
    mistral: "Mistral",
    openai: "OpenAI",
    perplexity: "Perplexity",
    vercel: "Vercel",
    vertex: "VertexAI",
    "x-ai": "X.ai",
    "z-ai": "Z.ai",
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
