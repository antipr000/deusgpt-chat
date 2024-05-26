'use client';

import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';
import { v4 } from 'uuid';

import {
  createChatSession,
  getAllAdminIntegrations,
  getAllChatSessions,
  getAllIntegrations,
} from '@/helpers/api';
import { handleEvent, postMessageToParent } from '@/helpers/iframe.notification';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
// import { messageService } from '@/services/message';
// import { sessionService } from '@/services/session';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { selectedChatSessionAtom } from '@/store/atoms/selectedChatSession.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { userAtom } from '@/store/atoms/user.atom';
import { ChatSession } from '@/types/common/ChatSession.type';
import { Integration } from '@/types/common/Integration.type';

// const checkHasConversation = async () => {
//   const hasMessages = await messageService.hasMessages();
//   const hasAgents = await sessionService.hasSessions();
//   return hasMessages || hasAgents;
// };

const Setup = memo(() => {
  const router = useRouter();

  const idToken = useAtomValue(idTokenAtom);
  const user = useAtomValue(userAtom);
  const [_1, setIntegrations] = useAtom(integrationsAtom);

  useEffect(() => {
    postMessageToParent('admin-load', true);

    window.addEventListener('message', handleEvent);
  }, []);

  const loadAllData = async () => {
    const promiseArr = [getAllAdminIntegrations()];

    const [integrations, chatSessions] = await Promise.all<[Integration[], ChatSession[]]>(
      // @ts-ignore
      promiseArr,
    );
    setIntegrations(integrations);
  };

  useEffect(() => {
    console.log('Inside iframe', idToken, user);
    if (idToken && user) {
      loadAllData().then(() => {
        router.push('/admin/models');
      });
    }
  }, [idToken, user]);

  return null;
});

export default Setup;
