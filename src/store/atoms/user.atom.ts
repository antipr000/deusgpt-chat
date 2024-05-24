import { atom } from 'jotai';

export type UserData = {
  email: string;
  firebaseId: string;
  firstName?: string;
  lastName?: string;
  plan: string;
};

export const userAtom = atom<UserData | null>({
  firebaseId: 'Uu8w8IY7ERhr57CHUkabPMDybfo2',
  firstName: 'Soham',
  lastName: 'Mukherjee',
  email: 'rockstarsam1234@gmail.com',
  plan: 'premium',
});
