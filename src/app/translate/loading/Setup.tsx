'use client';

import {  useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { memo, useEffect } from 'react';

import { handleEvent, postMessageToParent } from '@/helpers/iframe.notification';
// import { messageService } from '@/services/message';
// import { sessionService } from '@/services/session';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { userAtom } from '@/store/atoms/user.atom';

// const checkHasConversation = async () => {
//   const hasMessages = await messageService.hasMessages();
//   const hasAgents = await sessionService.hasSessions();
//   return hasMessages || hasAgents;
// };

const Setup = memo(() => {
  const router = useRouter();

  const idToken = useAtomValue(idTokenAtom);
  const user = useAtomValue(userAtom);
  const integrations = useAtomValue(integrationsAtom);

  useEffect(() => {
    postMessageToParent('translate-load', true);

    window.addEventListener('message', handleEvent);
  }, []);


  useEffect(() => {
    console.log('Inside iframe', idToken, user);
    if (idToken && user && integrations?.length) {
      router.push('/translate/translate');
    }
  }, [idToken, user, integrations]);

  return null;
});

export default Setup;
