'use client';

import { ActionIcon, ChatHeader } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';

import HeaderAction from './HeaderAction';
import Main from './Main';

const useStyles = createStyles(({ css }) => ({
  left: css`
    left: 50%;
    transform: translateX(-50%);
    flex: 0 auto;
  `,
}));

const Header = () => {
  const { styles } = useStyles();
  const showSessionPanel: boolean | undefined = useGlobalStore(
    (s) => s.preference.showSessionPanel,
  );
  const { t } = useTranslation('chat');

  return (
    <div style={{ position: 'relative' }}>
      <ActionIcon
        aria-label={t('agentsAndConversations')}
        icon={showSessionPanel ? PanelLeftClose : PanelLeftOpen}
        onClick={() => {
          const currentShowSessionPanel = useGlobalStore.getState().preference.showSessionPanel;
          useGlobalStore.getState().updatePreference({
            sessionsWidth: currentShowSessionPanel ? 0 : 320,
            showSessionPanel: !currentShowSessionPanel,
          });
        }}
        size={DESKTOP_HEADER_ICON_SIZE}
        style={{ left: 12, marginTop: 14, position: 'absolute', zIndex: 20 }}
        title={t('agentsAndConversations')}
      />
      <ChatHeader
        classNames={{ left: styles.left }}
        left={<Main />}
        right={<HeaderAction />}
        style={{ zIndex: 11 }}
      />
    </div>
  );
};

export default Header;
