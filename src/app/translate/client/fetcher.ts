import { GPT_MODELS } from '../constants';
import { GPTModel, OpenAIModel } from '../types';
import { trimText } from '../utils';
import OpenAIClient from './index';

export const fetchTranslation = async (params: {
  token: string;
  engine: OpenAIModel;
  prompt: string;
  temperatureParam: number;
  queryText: string;
}) => {
  const { token, engine, prompt, queryText, temperatureParam } = params;
  if (!token) {
    throw new Error('No API Key found!');
  }
  if (!prompt) {
    throw new Error('No prompt found!');
  }

  const getRadomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const isGptModel = (GPT_MODELS as unknown as string[]).includes(engine);

  const tmpParam =
    +temperatureParam > 0.4 && +temperatureParam <= 1.0
      ? +temperatureParam
      : getRadomNumber(0.5, 1.0);

  if (isGptModel) {
    const resp = await OpenAIClient.chatCompletions(
      token,
      prompt,
      queryText,
      engine as GPTModel,
      tmpParam,
    );
    const text = resp.data.choices
      .map((choice) => (choice.message?.content || '').trim())
      .join('\n')
      .trim();
    return trimText(text);
  }

  const resp = await OpenAIClient.completions(token, prompt, queryText, engine, tmpParam);
  const text = resp.data.choices
    .map((choice) => choice.text.trim())
    .join('\n')
    .trim();
  return trimText(text);
};
