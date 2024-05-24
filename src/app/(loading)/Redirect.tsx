'use client';

import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { getAllChatSessions, getAllIntegrations } from '@/helpers/api';
// import { messageService } from '@/services/message';
// import { sessionService } from '@/services/session';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { userAtom } from '@/store/atoms/user.atom';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';

// const checkHasConversation = async () => {
//   const hasMessages = await messageService.hasMessages();
//   const hasAgents = await sessionService.hasSessions();
//   return hasMessages || hasAgents;
// };

const Redirect = memo(() => {
  const router = useRouter();

  const idToken = useAtomValue(idTokenAtom);
  const user = useAtomValue(userAtom);
  const [_1, setIntegrations] = useAtom(integrationsAtom);
  const [_2, setChatSessions] = useAtom(chatSessionsAtom);

  const loadAllData = async () => {
    console.log("Hello")
    const integrations = await getAllIntegrations();
    const chatSessions = await getAllChatSessions();
    setIntegrations(integrations);
    setChatSessions(chatSessions);
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
