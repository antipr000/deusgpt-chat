import { atom } from 'jotai';

export type UserData = {
  firstName?: String;
  lastName?: String;
  email: String;
  plan: String;
};

export const userAtom = atom<UserData | null>(null);
