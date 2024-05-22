import { ActionIcon, Icon } from '@lobehub/ui';
import { App, Dropdown, DropdownProps, MenuProps } from 'antd';
import { MoreVertical, Plus } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useSessionStore } from '@/store/session';

interface ActionsProps extends Pick<DropdownProps, 'onOpenChange'> {
  id?: string;
  isCustomGroup?: boolean;
  isPinned?: boolean;
  openConfigModal?: () => void;
  openRenameModal?: () => void;
}

type ItemOfType<T> = T extends (infer Item)[] ? Item : never;
type MenuItemType = ItemOfType<MenuProps['items']>;

const Actions = memo<ActionsProps>(({ id, onOpenChange, isPinned }) => {
  const { t } = useTranslation('chat');
  const { message } = App.useApp();

  const [createSession] = useSessionStore((s) => [s.createSession]);

  const newAgentPublicItem: MenuItemType = {
    icon: <Icon icon={Plus} />,
    key: 'newAgent',
    label: t('newAgent'),
    onClick: async ({ domEvent }) => {
      domEvent.stopPropagation();
      const key = 'createNewAgentInGroup';
      message.loading({ content: t('sessionGroup.creatingAgent'), duration: 0, key });

      await createSession({ group: id, pinned: isPinned });

      message.destroy(key);
      message.success({ content: t('sessionGroup.createAgentSuccess') });
    },
  };

  const defaultItems: MenuProps['items'] = useMemo(() => [newAgentPublicItem], []);

  return (
    <Dropdown
      arrow={false}
      menu={{
        items: defaultItems,
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
        },
      }}
      onOpenChange={onOpenChange}
      trigger={['click']}
    >
      <ActionIcon
        icon={MoreVertical}
        onClick={(e) => {
          e.stopPropagation();
        }}
        size={{ blockSize: 22, fontSize: 16 }}
        style={{ marginRight: -8 }}
      />
    </Dropdown>
  );
});

export default Actions;
