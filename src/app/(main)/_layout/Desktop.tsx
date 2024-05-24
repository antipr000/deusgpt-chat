'use client';

import { useTheme } from 'antd-style';
import { useAtom } from 'jotai';
import { memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useIsPWA } from '@/hooks/useIsPWA';
import { idTokenAtom } from '@/store/atoms/token.atom';
import { UserData, userAtom } from '@/store/atoms/user.atom';

import { LayoutProps } from './type';

const Layout = memo<LayoutProps>(({ children, nav }) => {
  const isPWA = useIsPWA();
  const theme = useTheme();
  const [_, setIdToken] = useAtom(idTokenAtom);
  const [_2, setUser] = useAtom(userAtom);

  const handleEvent = ({ data }: { data: { payload: any; type: string } }) => {
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

  return (
    <Flexbox
      height={'100%'}
      horizontal
      style={{
        borderTop: isPWA ? `1px solid ${theme.colorBorder}` : undefined,
        position: 'relative',
      }}
      width={'100%'}
    >
      {children}
    </Flexbox>
  );
});

Layout.displayName = 'DesktopMainLayout';

export default Layout;
