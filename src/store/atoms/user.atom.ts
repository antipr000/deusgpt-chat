import { atom } from 'jotai';

export type UserData = {
  email: string;
  firebaseId: string;
  firstName?: string;
  lastName?: string;
  plan: string;
};

export const userAtom = atom<UserData | null>(null);
