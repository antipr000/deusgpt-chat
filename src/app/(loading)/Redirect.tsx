'use client';

import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { getAllIntegrations } from '@/helpers/api';
import { messageService } from '@/services/message';
import { sessionService } from '@/services/session';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { userAtom } from '@/store/atoms/user.atom';
import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/selectors';

const checkHasConversation = async () => {
  const hasMessages = await messageService.hasMessages();
  const hasAgents = await sessionService.hasSessions();
  return hasMessages || hasAgents;
};

const Redirect = memo(() => {
  const router = useRouter();

  const idToken = useAtomValue(idTokenAtom);
  const user = useAtomValue(userAtom);
  const [_, setIntegrations] = useAtom(integrationsAtom);

  const loadAllData = async () => {
    const integrations = await getAllIntegrations();
    setIntegrations(integrations);
  };

  useEffect(() => {
    if (idToken && user) {
      loadAllData().then(() => {
        router.replace('/chat');
      });
    }
  }, [idToken, user]);

  return null;
});

export default Redirect;
