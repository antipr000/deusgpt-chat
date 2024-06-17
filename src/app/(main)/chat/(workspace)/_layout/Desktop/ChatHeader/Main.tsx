'use client';

import { Avatar, ChatHeaderTitle } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { useAtomValue } from 'jotai';
import { Fragment, Suspense, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useInitAgentConfig } from '@/app/(main)/chat/(workspace)/_layout/useInitAgentConfig';
import { useOpenChatSettings } from '@/hooks/useInterceptingRoutes';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
import { useSessionStore } from '@/store/session';
import { sessionMetaSelectors, sessionSelectors } from '@/store/session/selectors';

import { selectedChatSessionAtom } from '../../../../../../../store/atoms/selectedChatSession.atom';

const Main = memo(() => {
  const { t } = useTranslation('chat');

  useInitAgentConfig();

  const [init, isInbox, title, description, avatar, backgroundColor] = useSessionStore((s) => [
    sessionSelectors.isSomeSessionActive(s),
    sessionSelectors.isInboxSession(s),
    sessionMetaSelectors.currentAgentTitle(s),
    sessionMetaSelectors.currentAgentDescription(s),
    sessionMetaSelectors.currentAgentAvatar(s),
    sessionMetaSelectors.currentAgentBackgroundColor(s),
  ]);

  const chatSessions = useAtomValue(chatSessionsAtom);

  const openChatSettings = useOpenChatSettings();
  const selectedChatSessionId = useAtomValue(selectedChatSessionAtom);
  const selectedChatSession = chatSessions.find(
    (session) => session.sessionId === selectedChatSessionId,
  );

  const displayTitle = isInbox ? t('inbox.title') : selectedChatSession?.name;
  const displayDesc = isInbox ? t('inbox.desc') : description;

  return !init ? (
    <Flexbox horizontal>
      <Skeleton
        active
        avatar={{ shape: 'circle', size: 'default' }}
        paragraph={false}
        title={{ style: { margin: 0, marginTop: 8 }, width: 200 }}
      />
    </Flexbox>
  ) : (
    <Flexbox align={'center'} gap={4} horizontal>
      {!isInbox && (
        <>
          <Avatar
            avatar={avatar}
            background={backgroundColor}
            onClick={() => openChatSettings()}
            size={40}
            title={selectedChatSession?.name}
          />
          <ChatHeaderTitle desc={displayDesc} title={displayTitle} />
        </>
      )}
    </Flexbox>
  );
});

export default () => (
  <Suspense
    fallback={
      <Skeleton
        active
        avatar={{ shape: 'circle', size: 'default' }}
        paragraph={false}
        title={{ style: { margin: 0, marginTop: 8 }, width: 200 }}
      />
    }
  >
    <Main />
  </Suspense>
);
