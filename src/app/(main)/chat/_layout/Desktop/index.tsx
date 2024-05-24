import { Flexbox } from 'react-layout-kit';

import Migration from '../../features/Migration';
import { LayoutProps } from '../type';
import SessionPanel from './SessionPanel';

const Layout = ({ children, session }: LayoutProps) => {
  return (
    <>
      <Flexbox
        height={'100%'}
        horizontal
        style={{ overflow: 'hidden', position: 'relative' }}
        width={'100%'}
      >
        <SessionPanel>{session}</SessionPanel>
        <Flexbox flex={1} style={{ overflow: 'hidden', position: 'relative' }}>
          {children}
        </Flexbox>
      </Flexbox>
      <Migration />
    </>
  );
};

Layout.displayName = 'DesktopChatLayout';

export default Layout;
