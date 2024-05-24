import { Flex } from 'antd';

import ServerLayout from '@/components/server/ServerLayout';

import SettingButton from '../(workspace)/features/SettingButton';
import Desktop from './_layout/Desktop';
import Mobile from './_layout/Mobile';
import Clear from './clear';
import SessionHydration from './features/SessionHydration';
import SessionListContent from './features/SessionListContent';

const Layout = ServerLayout({ Desktop, Mobile });

const Session = () => {
  return (
    <>
      <Layout>
        <SessionListContent />
        <Flex
          justify="space-between"
          style={{
            paddingBottom: '10px',
          }}
        >
          <SettingButton />
          <Clear />
        </Flex>
      </Layout>
      <SessionHydration />
    </>
  );
};

Session.displayName = 'Session';

export default Session;
