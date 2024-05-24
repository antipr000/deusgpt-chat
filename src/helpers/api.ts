import axios from 'axios';

import { store } from '@/store/atoms/store.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { ChatSession } from '@/types/common/ChatSession.type';
import { Integration } from '@/types/common/Integration.type';

const instance = axios.create({
  baseURL: 'http://localhost:3010/api',
});

instance.interceptors.request.use((config) => {
  const idToken = store.get(idTokenAtom);
  console.log('ID token', idToken);
  if (idToken) {
    config.headers.Authorization = idToken;
  }
  return config;
});

const getAllIntegrations = async (): Promise<Integration[]> => {
  const { data }: { data: Integration[] } = await instance.get('/integrations');
  return data;
};

const createChatSession = async (request: ChatSession): Promise<ChatSession> => {
  const { data } = await instance.post('/chat-session', request);
  return data;
};

const getAllChatSessions = async (): Promise<ChatSession[]> => {
  const { data } = await instance.get('/chat-session');
  return data;
};

const updateChatSession = async (
  sessionId: string,
  request: Partial<ChatSession>,
): Promise<ChatSession[]> => {
  const { data } = await instance.patch(`/chat-session/${sessionId}`, request);
  return data;
};

const deleteChatSession = async (sessionId: string): Promise<ChatSession[]> => {
  const { data } = await instance.delete(`/chat-session/${sessionId}`);
  return data;
};

const addUsage = async ({
  model,
  queryType,
  chatId,
}: {
  model: String;
  queryType?: String;
  chatId?: String;
}): Promise<Number> => {
  const { data } = await instance.post('/usage', {
    modelId: model,
    queryType: queryType,
    chatId: chatId,
  });

  return data.count;
};

const getUsage = async (model: String): Promise<Number> => {
  const { data }: { data: { count: Number } } = await axios.get(`/usage?model=${model}`);
  return data.count;
};

export {
  getAllIntegrations,
  createChatSession,
  getAllChatSessions,
  updateChatSession,
  deleteChatSession,
  addUsage,
  getUsage,
};
