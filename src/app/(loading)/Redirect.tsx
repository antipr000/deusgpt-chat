'use client';

import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';
import { v4 } from 'uuid';

import { createChatSession, getAllChatSessions, getAllIntegrations } from '@/helpers/api';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
// import { messageService } from '@/services/message';
// import { sessionService } from '@/services/session';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { selectedChatSessionAtom } from '@/store/atoms/selectedChatSession.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { UserData, userAtom } from '@/store/atoms/user.atom';

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
  const [_3, setSelectedChatSession] = useAtom(selectedChatSessionAtom);
  const [_4, setIdToken] = useAtom(idTokenAtom);
  const [_5, setUser] = useAtom(userAtom);

  const handleEvent = ({ data }: { data: { payload: any; type: string } }) => {
    console.log('Received message from parent iframe');
    const { type, payload } = data;

    if (type === 'id-token') {
      // set state
      const { idToken, user }: { idToken: string; user: UserData } = payload;
      setIdToken(idToken);
      setUser(user);
    }
  };

  useEffect(() => {
    window.parent.postMessage({ payload: true, type: 'chat-load' }, '*');

    window.addEventListener('message', handleEvent);
  }, []);

  const loadAllData = async () => {
    const integrations = await getAllIntegrations();
    const chatSessions = await getAllChatSessions();
    setIntegrations(integrations);
    setChatSessions(chatSessions);
    if (chatSessions.length) {
      setSelectedChatSession(chatSessions[0]);
      return chatSessions[0].sessionId;
    } else {
      const newSession = await createChatSession({
        agent: 'gpt',
        createdAt: new Date(),
        sessionId: v4(),
        firebaseId: '',
        name: 'DeusGPT',
      });
      setChatSessions([newSession]);
      setSelectedChatSession(newSession);
      return newSession.sessionId;
    }
  };

  useEffect(() => {
    console.log('Inside iframe', idToken, user);
    if (idToken && user) {
      loadAllData().then((sessionId) => {
        if (sessionId) {
          router.replace(`/chat?session=${sessionId}`);
        } else {
          router.replace('/chat');
        }
      });
    }
  }, [idToken, user]);

  return null;
});

export default Redirect;
