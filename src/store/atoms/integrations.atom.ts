import { atom } from 'jotai';

import { Integration } from '@/types/common/Integration.type';

const integrations: Integration[] = [];
export const integrationsAtom = atom<Integration[] | null>(integrations);
