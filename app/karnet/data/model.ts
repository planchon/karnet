import { Anthropic, Gemini, Grok, OpenAI } from '@lobehub/icons';

type Provider = {
  providerName: string;
  providerID: string;
  models: {
    id: string;
    name: string;
    searchTerms: string[];
    icon: any;
  }[];
};

export const models: Provider[] = [
  {
    providerName: 'OpenAI',
    providerID: 'openai',
    models: [
      {
        id: 'gpt-5',
        name: 'GPT-5',
        searchTerms: ['gpt-5'],
        icon: OpenAI,
      },
      {
        id: 'gpt-5-nano',
        name: 'GPT-5 Nano',
        searchTerms: ['gpt-5-nano'],
        icon: OpenAI,
      },
      {
        id: 'gpt-5-mini',
        name: 'GPT-5 Mini',
        searchTerms: ['gpt-5-mini'],
        icon: OpenAI,
      },
      {
        id: 'o3',
        name: 'O3',
        searchTerms: ['o3'],
        icon: OpenAI,
      },
    ],
  },
  {
    providerName: 'Anthropic',
    providerID: 'anthropic',
    models: [
      {
        id: 'claude-3-7-sonnet',
        name: 'Claude 3.7 Sonnet',
        searchTerms: ['claude'],
        icon: Anthropic,
      },
      {
        id: 'claude-4-sonnet',
        name: 'Claude 4 Sonnet',
        searchTerms: ['claude'],
        icon: Anthropic,
      },
      {
        id: 'claude-4-opus',
        name: 'Claude 4 Opus',
        searchTerms: ['claude'],
        icon: Anthropic,
      },
    ],
  },
  {
    providerName: 'Google',
    providerID: 'google',
    models: [
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        searchTerms: ['gemini'],
        icon: Gemini,
      },
      {
        id: 'gemini-2.5-flash-mini',
        name: 'Gemini 2.5 Flash Mini',
        searchTerms: ['gemini'],
        icon: Gemini,
      },
    ],
  },
  {
    providerName: 'xAI',
    providerID: 'xai',
    models: [
      {
        id: 'grok-4',
        name: 'Grok 4',
        searchTerms: ['grok'],
        icon: Grok,
      },
    ],
  },
];
