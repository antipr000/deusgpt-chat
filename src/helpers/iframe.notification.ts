import { store } from '@/store/atoms/store.atom';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { userAtom } from '@/store/atoms/user.atom';
import { User } from '@/types/common/User.type';

export const postMessageToParent = (type: string, payload: any) => {
  window.parent.postMessage({ type, payload }, '*');
};

export const handleEvent = ({ data }: { data: { payload: any; type: string } }) => {
  console.log('Received message from parent iframe');
  const { type, payload } = data;

  if (type === 'id-token') {
    // set state
    const { idToken, user }: { idToken: string; user: User } = payload;
    store.set(idTokenAtom, idToken);
    store.set(userAtom, user);
  }
};
