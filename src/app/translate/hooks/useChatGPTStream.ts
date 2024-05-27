import { useCallback, useState } from 'react';

import OpenAIClient from '../client';
import { GPTModel, GPT_MODELS } from '../constants';
import { ChatCompletionsResponse, OpenAIModel } from '../types';

function getRadomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function useChatGPTStream() {
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(
    (params: {
      engine: OpenAIModel;
      prompt: string;
      temperatureParam: number;
      queryText: string;
    }) => {
      const { engine, prompt, queryText, temperatureParam } = params;
      if (loading) {
        console.warn('Already loading!');
        return;
      }
      setData('');
      setLoading(true);
      if (!prompt) {
        setError('No prompt found!');
        setLoading(false);
        return;
      }

      const tmpParam =
        +temperatureParam > 0.4 && +temperatureParam <= 1.0
          ? +temperatureParam
          : getRadomNumber(0.5, 1.0);

      const isGptModel = GPT_MODELS.includes(engine as GPTModel);

      OpenAIClient.chatCompletionsStream(
        {
          prompt,
          query: queryText,
          model: isGptModel ? (engine as GPTModel) : 'gpt-3.5-turbo',
          temperature: tmpParam,
        },
        {
          async onopen(res) {
            setData('');
            setLoading(true);
            console.log('Res is: ', res.ok, res.status);
            console.log('Detailed res', res);
            if (res.ok && res.status === 200) {
              console.log('Connection made ', res.status);
              setError('');
            } else if (res.status >= 400 && res.status < 500 && res.status !== 429) {
              console.warn('Client side error ', res);
              setError('Client side error ' + res.status);
              setLoading(false);
            }
          },
          onmessage(event) {
            if (event.data === 'stop') {
              setError('');
              setLoading(false);
              return;
            }
            const parsedData = JSON.parse(event.data) as ChatCompletionsResponse;
            setData((prev) => prev + parsedData);
          },
          onclose() {
            setError('');
            setLoading(false);
          },
          onerror(err) {
            setError(err);
            setLoading(false);
          },
        },
      ).catch((err) => {
        setError(err);
        setLoading(false);
      });
    },
    [loading],
  );
  return { data, mutate, isError: !!error, isLoading: loading };
}
