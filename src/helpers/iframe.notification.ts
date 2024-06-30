import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { locationAtom } from '@/store/atoms/location.atom';
import { store } from '@/store/atoms/store.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { userAtom } from '@/store/atoms/user.atom';
import { ChatSession } from '@/types/common/ChatSession.type';
import { Integration } from '@/types/common/Integration.type';
import { User } from '@/types/common/User.type';

interface Payload {
  chatSessions: ChatSession[];
  idToken: string;
  integrations: Integration[];
  location: string;
  user: User;
}

export const postMessageToParent = (type: string, payload: any) => {
  window.parent.postMessage({ payload, type }, '*');
};

export const handleEvent = ({ data }: { data: { payload: any; type: string } }) => {
  console.log('Received message from parent iframe');
  const { type, payload } = data;

  if (type === 'id-token') {
    // set state
    const { chatSessions, idToken, integrations, location, user } = payload as Payload;

    store.set(idTokenAtom, idToken);
    store.set(userAtom, user);
    store.set(integrationsAtom, integrations);
    store.set(chatSessionsAtom, chatSessions);
    store.set(locationAtom, location);
  }
};
