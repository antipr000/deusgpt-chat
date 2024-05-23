import { atom } from 'jotai';
import { Integration } from '@/app/api/db/types/Integration.type';

const integrations: Integration[] = [
    {
        displayName: 'Open AI',
        enabled: true,
        models: [
            {
                displayName: 'GPT-3.5 Turbo',
                isPremium: true,
                name: 'gpt-3.5-turbo',
            },
            {
                displayName: 'GPT-4 Turbo',
                isPremium: false,
                name: 'gpt-4-turbo',
            }
        ],
        name: 'Open AI',
        proxy: 'https://openai.com',
    }
]
export const integrationsAtom = atom<Integration[] | null>(integrations);
