import { CollapseProps } from 'antd';
import isEqual from 'fast-deep-equal';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGlobalStore } from '@/store/global';
import { preferenceSelectors } from '@/store/global/selectors';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';
import { SessionDefaultGroup } from '@/types/session';

import Actions from '../SessionListContent/CollapseGroup/Actions';
import CollapseGroup from './CollapseGroup';
import SessionList from './List';

const DefaultMode = memo(() => {
  const { t } = useTranslation('chat');

  const [useFetchSessions] = useSessionStore((s) => [s.useFetchSessions]);
  useFetchSessions();

  const defaultSessions = useSessionStore(sessionSelectors.defaultSessions, isEqual);
  const customSessionGroups = useSessionStore(sessionSelectors.customSessionGroups, isEqual);
  const pinnedSessions = useSessionStore(sessionSelectors.pinnedSessions, isEqual);

  const [sessionGroupKeys, updatePreference] = useGlobalStore((s) => [
    preferenceSelectors.sessionGroupKeys(s),
    s.updatePreference,
  ]);

  const items = useMemo(
    () =>
      [
        {
          children: <SessionList dataSource={defaultSessions || []} />,
          extra: <Actions />,
          key: SessionDefaultGroup.Default,
          label: t('defaultList'),
        },
      ].filter(Boolean) as CollapseProps['items'],
    [customSessionGroups, pinnedSessions, defaultSessions],
  );

  return (
    <CollapseGroup
      activeKey={sessionGroupKeys}
      items={items}
      onChange={(keys) => {
        const expandSessionGroupKeys = typeof keys === 'string' ? [keys] : keys;

        updatePreference({ expandSessionGroupKeys });
      }}
    />
  );
});

DefaultMode.displayName = 'SessionDefaultMode';

export default DefaultMode;
