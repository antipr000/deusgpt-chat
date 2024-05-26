import {
  Anthropic,
  Azure,
  Bedrock,
  DeepSeek,
  Google,
  Groq,
  IconType,
  Minimax,
  Mistral,
  Moonshot,
  Ollama,
  OpenAI,
  OpenRouter,
  Perplexity,
  Together,
  ZeroOne,
  Zhipu,
} from '@lobehub/icons';
import { CompoundedIcon } from '@lobehub/icons/es/Adobe';

export type ModelAttributes = {
  title: string;
  Icon: IconType;
};
export type Model = Record<string, ModelAttributes>;

export const MODELS: Model = {
  openai: {
    title: 'OpenAI',
    Icon: OpenAI,
  },
  ollama: {
    title: 'Ollama',
    Icon: Ollama,
  },
  azure: {
    title: 'Azure OpenAI',
    Icon: Azure,
  },
  google: {
    title: 'Google',
    Icon: Google,
  },
  anthropic: {
    title: 'Anthropic',
    Icon: Anthropic,
  },
  bedrock: {
    title: 'Bedrock',
    Icon: Bedrock,
  },
  deepseek: {
    title: 'DeepSeek',
    Icon: DeepSeek,
  },
  openrouter: {
    title: 'OpenRouter',
    Icon: OpenRouter,
  },
  togetherai: {
    title: 'TogetherAI',
    Icon: Together,
  },
  groq: {
    title: 'Groq',
    Icon: Groq,
  },
  perplexity: {
    title: 'Perplexity',
    Icon: Perplexity,
  },
  minimax: {
    title: 'Minimax',
    Icon: Minimax,
  },
  mistral: {
    title: 'Mistral AI',
    Icon: Mistral,
  },
  moonshot: {
    title: 'Moonshot AI',
    Icon: Moonshot,
  },
  zhipu: {
    title: '智谱',
    Icon: Zhipu,
  },
  zeroone: {
    title: '01.AI 零一万物',
    Icon: ZeroOne,
  },
};
