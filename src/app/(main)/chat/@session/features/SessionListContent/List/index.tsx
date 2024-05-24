import { Empty } from 'antd';
import { createStyles } from 'antd-style';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';
import LazyLoad from 'react-lazy-load';

import { SESSION_CHAT_URL } from '@/const/url';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';
// import { LobeAgentSession } from '@/types/session';

import SkeletonList from '../SkeletonList';
import AddButton from './AddButton';
import SessionItem from './Item';
import { ChatSession } from '@/types/common/ChatSession.type';
import { useAtom, useAtomValue } from 'jotai';
import { selectedChatSessionAtom } from '@/store/atoms/selectedChatSession.atom';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';

const useStyles = createStyles(
  ({ css }) => css`
    min-height: 70px;
  `,
);
interface SessionListProps {
  dataSource?: ChatSession[];
  groupId?: string;
  showAddButton?: boolean;
}
const SessionList = memo<SessionListProps>(({ dataSource, groupId, showAddButton = true }) => {
  const { t } = useTranslation('chat');
  const isInit = useSessionStore((s) => sessionSelectors.isSessionListInit(s));
  const { showCreateSession } = useServerConfigStore(featureFlagsSelectors);
  const [_, setSelectedChatSession] = useAtom(selectedChatSessionAtom);
  const chatSessions = useAtomValue(chatSessionsAtom);

  const { styles } = useStyles();

  const onChatSessionClick = (sessionId: string) => {
    const session = chatSessions.find((session) => session.sessionId === sessionId)!;
    setSelectedChatSession(session)
  }

  const mobile = useServerConfigStore((s) => s.isMobile);
  const isEmpty = !dataSource || dataSource.length === 0;
  return !isInit ? (
    <SkeletonList />
  ) : !isEmpty ? (
    dataSource.map(({ sessionId }) => (
      <LazyLoad className={styles} key={sessionId}>
        <Link aria-label={sessionId} href={SESSION_CHAT_URL(sessionId, mobile)} onClick={() => onChatSessionClick(sessionId)}>
          <SessionItem id={sessionId} />
        </Link>
      </LazyLoad>
    ))
  ) : showCreateSession ? (
    showAddButton && <AddButton groupId={groupId} />
  ) : (
    <Center>
      <Empty description={t('emptyAgent')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </Center>
  );
});

export default SessionList;
