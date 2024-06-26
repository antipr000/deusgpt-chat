import axios from 'axios';

import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
import { store } from '@/store/atoms/store.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { ChatSession } from '@/types/common/ChatSession.type';
import { Integration } from '@/types/common/Integration.type';
import { Payment, PaymentWithUser } from '@/types/common/Payment.type';
import { User } from '@/types/common/User.type';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
});

instance.interceptors.request.use((config) => {
  const idToken = store.get(idTokenAtom);
  if (idToken) {
    config.headers.Authorization = idToken;
  }
  return config;
});

const getAllIntegrations = async (): Promise<Integration[]> => {
  const { data }: { data: Integration[] } = await instance.get('/integrations');
  return data;
};

const getAllAdminIntegrations = async (): Promise<Integration[]> => {
  const { data }: { data: Integration[] } = await instance.get('/integrations/admin');
  return data;
};

const updateIntegration = async (integration: Partial<Integration>) => {
  const { data } = await instance.patch('/integrations/admin', integration);
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
): Promise<ChatSession> => {
  const { data } = await instance.patch(`/chat-session/${sessionId}`, request);
  return data;
};

const deleteChatSession = async (sessionId: string): Promise<ChatSession[]> => {
  const { data } = await instance.delete(`/chat-session/${sessionId}`);
  return data;
};

const deleteChatSessions = async (): Promise<boolean> => {
  const { data } = await instance.delete<boolean>(`/chat-session`);
  store.set(chatSessionsAtom, () => []);
  return data;
};

const addUsage = async ({
  model,
  queryType,
  chatId,
}: {
  chatId?: string;
  model: string;
  queryType?: string;
}): Promise<number> => {
  const { data } = await instance.post('/usage', {
    chatId: chatId,
    modelId: model,
    queryType: queryType,
  });

  return data.count;
};

const getUsage = async (model: string): Promise<number> => {
  const { data }: { data: { count: number } } = await instance.get(`/usage?model=${model}`);
  return data.count;
};

const getUsageForDateRange = async (
  models: string,
  startDate: Date,
  endDate?: Date,
): Promise<number> => {
  const { data }: { data: { count: number } } = await instance.get(
    `/usage/date?models=${models}&startDate=${startDate.toISOString()}&endDate=${(endDate || new Date()).toISOString()}`,
  );
  return data.count;
};

const updateUser = async (userData: Partial<User>): Promise<User> => {
  const { data } = await instance.patch('/user', userData);
  return data;
};

const getAllUsers = async (): Promise<User[]> => {
  const { data } = await instance.get('/user');
  return data;
};

const getCountOfUsersInDateRange = async (startDate: Date, endDate?: Date): Promise<number> => {
  const { data } = await instance.get<number>(
    `/user?startDate=${startDate.toISOString()}&endDate=${(endDate || new Date()).toISOString()}`,
  );
  return data;
};

const getCountOfSubscribedUsersInDateRange = async (
  startDate: Date,
  endDate?: Date,
): Promise<number> => {
  const { data } = await instance.get<number>(
    `/user?subscribed=true&startDate=${startDate.toISOString()}&endDate=${(endDate || new Date()).toISOString()}`,
  );
  return data;
};

const getAllPayments = async (): Promise<PaymentWithUser[]> => {
  const { data } = await instance.get('/payment');
  return data;
};

const adminUpdatePayment = async (payment: Partial<Payment>): Promise<Payment> => {
  const { data } = await instance.patch('/payment', payment);
  return data;
};

const adminUpdateUser = async (user: Partial<User>): Promise<User> => {
  const { data } = await instance.patch('/user/admin', user);
  return data;
};

const adminDeleteUser = async (firebaseId: string): Promise<void> => {
  await instance.delete(`/user/admin?fbId=${firebaseId}`);
};

export {
  addUsage,
  createChatSession,
  deleteChatSession,
  deleteChatSessions,
  getAllChatSessions,
  getAllIntegrations,
  getAllUsers,
  getCountOfUsersInDateRange,
  getCountOfSubscribedUsersInDateRange,
  getUsage,
  getUsageForDateRange,
  updateChatSession,
  updateUser,
  updateIntegration,
  getAllAdminIntegrations,
  getAllPayments,
  adminUpdatePayment,
  adminUpdateUser,
  adminDeleteUser,
};
