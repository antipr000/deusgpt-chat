import { CollapseProps } from 'antd';
import { useAtomValue } from 'jotai';
// import isEqual from 'fast-deep-equal';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
import { useGlobalStore } from '@/store/global';
import { preferenceSelectors } from '@/store/global/selectors';
import { useSessionStore } from '@/store/session';
// import { sessionSelectors } from '@/store/session/selectors';
import { SessionDefaultGroup } from '@/types/session';

import Actions from '../SessionListContent/CollapseGroup/Actions';
import CollapseGroup from './CollapseGroup';
import SessionList from './List';

const DefaultMode = memo(() => {
  const { t } = useTranslation('chat');

  const [useFetchSessions] = useSessionStore((s) => [s.useFetchSessions]);
  useFetchSessions();

  const defaultSessions = useAtomValue(chatSessionsAtom);

  const [keywords] = useSessionStore((s) => [s.sessionSearchKeywords]);

  const chatSessions = useMemo(() => {
    if (!keywords) return defaultSessions;

    return (
      defaultSessions?.filter((session) => {
        return session.name?.toLowerCase().includes(keywords.toLowerCase());
      }) || []
    );
  }, [defaultSessions, keywords]);

  const [sessionGroupKeys, updatePreference] = useGlobalStore((s) => [
    preferenceSelectors.sessionGroupKeys(s),
    s.updatePreference,
  ]);

  const items = useMemo(
    () =>
      [
        {
          children: <SessionList dataSource={chatSessions || []} />,
          extra: <Actions />,
          key: SessionDefaultGroup.Default,
          label: t('defaultList'),
        },
      ].filter(Boolean) as CollapseProps['items'],
    [chatSessions],
  );

  return (
    <CollapseGroup
      activeKey={sessionGroupKeys}
      items={items}
      onChange={(keys) => {
        const expandSessionGroupKeys = typeof keys === 'string' ? [keys] : keys;

        updatePreference({ expandSessionGroupKeys });
      }}
      style={{
        flexGrow: 1,
      }}
    />
  );
});

DefaultMode.displayName = 'SessionDefaultMode';

export default DefaultMode;
