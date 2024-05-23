import axios from 'axios';

import { store } from '@/store/atoms/store.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
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

export { getAllIntegrations };
