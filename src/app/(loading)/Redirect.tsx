'use client';

import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { handleEvent, postMessageToParent } from '@/helpers/iframe.notification';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
// import { messageService } from '@/services/message';
// import { sessionService } from '@/services/session';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { selectedChatSessionAtom } from '@/store/atoms/selectedChatSession.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { userAtom } from '@/store/atoms/user.atom';

// const checkHasConversation = async () => {
//   const hasMessages = await messageService.hasMessages();
//   const hasAgents = await sessionService.hasSessions();
//   return hasMessages || hasAgents;
// };

const Redirect = memo(() => {
  const router = useRouter();

  const idToken = useAtomValue(idTokenAtom);
  const user = useAtomValue(userAtom);
  const integrations = useAtomValue(integrationsAtom);
  const chatSessions = useAtomValue(chatSessionsAtom);
  const [_, setSelectedChatSession] = useAtom(selectedChatSessionAtom);

  useEffect(() => {
    postMessageToParent('chat-load', true);

    window.addEventListener('message', handleEvent);
  }, []);

  useEffect(() => {
    if (idToken && user && chatSessions.length && integrations?.length) {
      const sessionId = chatSessions[0].sessionId;
      setSelectedChatSession(sessionId);
      router.replace(`/chat?session=${sessionId}`);
    }
  }, [idToken, user, chatSessions, integrations]);

  return null;
});

export default Redirect;
