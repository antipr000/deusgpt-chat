import { FetchEventSourceInit, fetchEventSource } from '@microsoft/fetch-event-source';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useRef, useState } from 'react';

import { LOBE_CHAT_AUTH_HEADER } from '@/const/auth';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { store } from '@/store/atoms/store.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';

import { ChatCompletionsResponse, CompletionsResponse, GPTModel, OpenAIModel } from '../types';
import apis from './apis';

let baseUrl = apis.baseUrl;

const client = axios.create({ baseURL: baseUrl });

client.interceptors.request.use((config) => {
  const idToken = store.get(idTokenAtom);
  if (idToken) {
    config.headers[LOBE_CHAT_AUTH_HEADER] = idToken;
  }
  return config;
});

export function setApiBaseUrl(url: string) {
  client.defaults.baseURL = url;
  baseUrl = url;
}

export function useAxios(config: AxiosRequestConfig) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const controllerRef = useRef(new AbortController());
  const cancel = () => {
    controllerRef.current.abort();
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await client.request({
          signal: controllerRef.current.signal,
          ...config,
        });

        setData(response.data);
      } catch (error) {
        const { detail } = error as Record<string, string>;
        setError(detail);
      } finally {
        setLoaded(true);
      }
    })();
  }, [config]);

  return { data, error, loaded, cancel };
}

const getProviderName = (modelName: string) => {
  const integrations = store.get(integrationsAtom);
  return integrations?.find((integration) =>
    integration.models.find((model) => model.name === modelName),
  )?.name;
};

export async function completions(
  prompt: string,
  query: string,
  model: Omit<OpenAIModel, GPTModel> = 'text-davinci-003',
  temperature = 0,
  maxTokens = 1000,
  topP = 1,
  frequencyPenalty = 1,
  presencePenalty = 1,
) {
  const providerName: string | undefined = getProviderName(model as string);

  if (!providerName) {
    throw Error('Model is not valid: ' + model);
  }

  const url = `/${providerName}`;
  const config = {};

  const body = {
    prompt: `${prompt}:\n\n"${query}" =>`,
    model,
    temperature,
    // eslint-disable-next-line camelcase
    max_tokens: maxTokens,
    // eslint-disable-next-line camelcase
    top_p: topP,
    // eslint-disable-next-line camelcase
    frequency_penalty: frequencyPenalty,
    // eslint-disable-next-line camelcase
    presence_penalty: presencePenalty,
  };

  const response = await client.post<CompletionsResponse>(url, body, config);
  return response;
}

export async function chatCompletions(
  prompt: string,
  query: string,
  model: GPTModel = 'gpt-3.5-turbo',
  temperature = 0,
  maxTokens = 1000,
  topP = 1,
  frequencyPenalty = 1,
  presencePenalty = 1,
) {
  const url = '/openai';
  const config = {};

  const body = {
    model,
    temperature,
    // eslint-disable-next-line camelcase
    max_tokens: maxTokens,
    // eslint-disable-next-line camelcase
    top_p: topP,
    // eslint-disable-next-line camelcase
    frequency_penalty: frequencyPenalty,
    // eslint-disable-next-line camelcase
    presence_penalty: presencePenalty,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: `"${query}"` },
    ],
  };

  const response = await client.post<ChatCompletionsResponse>(url, body, config);
  return response;
}

export async function chatCompletionsStream(
  params: {
    prompt: string;
    query: string;
    model?: GPTModel;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  },
  options: FetchEventSourceInit,
) {
  const {
    prompt,
    query,
    model = 'gpt-3.5-turbo',
    temperature = 0,
    maxTokens = 1000,
    topP = 1,
    frequencyPenalty = 1,
    presencePenalty = 1,
  } = params;
  const url = '/openai';

  const body = {
    model,
    temperature,
    // eslint-disable-next-line camelcase
    max_tokens: maxTokens,
    // eslint-disable-next-line camelcase
    top_p: topP,
    // eslint-disable-next-line camelcase
    frequency_penalty: frequencyPenalty,
    // eslint-disable-next-line camelcase
    presence_penalty: presencePenalty,
    stream: true,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: `"${query}"` },
    ],
  };

  const idToken: string | null = store.get(idTokenAtom);

  const response = await fetchEventSource(baseUrl + url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      [LOBE_CHAT_AUTH_HEADER]: idToken!!,
    },
    openWhenHidden: true,
    ...options,
  });
  return response;
}

export default {
  setApiBaseUrl,
  useAxios,
  completions,
  chatCompletions,
  chatCompletionsStream,
};
