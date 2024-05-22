import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { userAtom } from '@/store/atoms/user.atom';

import { parseGreetingTime } from './greetingTime';

export const useGreeting = () => {
  const { t } = useTranslation('welcome');
  const user = useAtomValue(userAtom);

  const [greeting, setGreeting] = useState<'morning' | 'noon' | 'afternoon' | 'night'>();

  useEffect(() => {
    setGreeting(parseGreetingTime());
  }, []);

  return (
    greeting &&
    t(`guide.welcome.${greeting}`) +
      (user?.firstName ? `, ${user?.firstName} ${user?.lastName}` : `, ${user?.email}`)
  );
};
