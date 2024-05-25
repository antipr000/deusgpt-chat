import { atom } from 'jotai';

import { User } from '@/types/common/User.type';

export const userAtom = atom<User | null>(null);
