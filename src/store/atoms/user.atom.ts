import { atom } from 'jotai';

export type UserData = {
  email: string;
  firstName?: string;
  lastName?: string;
  plan: string;
};

export const userAtom = atom<UserData | null>({
  email: "debjit@gmail.com",
  firstName: 'Debjit',
  lastName: 'Majumder',
  plan: "standard"
});
