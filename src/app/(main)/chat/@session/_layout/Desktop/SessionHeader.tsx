'use client';

import { ActionIcon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { MessageSquarePlus } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
// import SyncStatusTag from '@/features/SyncStatusInspector';
import { useActionSWR } from '@/libs/swr';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';

import SessionSearchBar from '../../features/SessionSearchBar';

export const useStyles = createStyles(({ css, token }) => ({
  logo: css`
    fill: ${token.colorText};
  `,
  top: css`
    position: sticky;
    top: 0;
  `,
}));

const Header = memo(() => {
  const { styles } = useStyles();
  const { t } = useTranslation('chat');
  const [createSession] = useSessionStore((s) => [s.createSession]);
  const { showCreateSession } = useServerConfigStore(featureFlagsSelectors);

  const { mutate, isValidating } = useActionSWR('session.createSession', () => createSession());

  return (
    <Flexbox className={styles.top} gap={16} padding={16}>
      <Flexbox distribution={'space-between'} horizontal>
        <Flexbox align={'center'} gap={4} horizontal>
          <img src="logo.png" width={50} height={50} />
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>DeusGPT</div>
        </Flexbox>
        {showCreateSession && (
          <ActionIcon
            icon={MessageSquarePlus}
            loading={isValidating}
            onClick={() => mutate()}
            size={DESKTOP_HEADER_ICON_SIZE}
            style={{ flex: 'none' }}
            title={t('newChat')}
          />
        )}
      </Flexbox>
      <SessionSearchBar />
    </Flexbox>
  );
});

export default Header;
