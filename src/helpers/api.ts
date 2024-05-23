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
  const { data } = await instance.post('/chat-session');
  return data;
};

const getAllChatSessions = async (): Promise<ChatSession[]> => {
  const { data } = await instance.get('/chat-session');
  return data;
};

const updateChatSession = async (): Promise<ChatSession[]> => {
  const { data } = await instance.patch('/chat-session');
  return data;
};

export { getAllIntegrations, createChatSession, getAllChatSessions, updateChatSession };
