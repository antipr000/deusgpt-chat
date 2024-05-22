import { ActionIcon, Icon } from '@lobehub/ui';
import { App, Dropdown, type MenuProps } from 'antd';
import { createStyles } from 'antd-style';
import { MoreVertical, PencilLine, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useSessionStore } from '@/store/session';
import { sessionHelpers } from '@/store/session/helpers';
import { sessionSelectors } from '@/store/session/selectors';

const useStyles = createStyles(({ css }) => ({
  modalRoot: css`
    z-index: 2000;
  `,
}));

interface ActionProps {
  group: string | undefined;
  id: string;
  openCreateGroupModal: () => void;
  setOpen: (open: boolean) => void;
}

const Actions = memo<ActionProps>(({ id, setOpen }) => {
  const { styles } = useStyles();
  const { t } = useTranslation('chat');
  const router = useRouter();

  const [pin, removeSession] = useSessionStore((s) => {
    const session = sessionSelectors.getSessionById(id)(s);
    return [
      sessionHelpers.getSessionPinned(session),
      s.removeSession,
      s.pinSession,
      s.duplicateSession,
      s.updateSessionGroupId,
    ];
  });

  const { modal, message } = App.useApp();

  // const hasDivider = !isDefault || Object.keys(sessionByGroup).length > 0;

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        icon: <Icon icon={PencilLine} />,
        key: 'pin',
        label: t('rename'),
        onClick: () => {
          // Need to modify
        },
      },
      {
        type: 'divider',
      },
      {
        danger: true,
        icon: <Icon icon={Trash} />,
        key: 'delete',
        label: t('delete', { ns: 'common' }),
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
          modal.confirm({
            centered: true,
            okButtonProps: { danger: true },
            onOk: async () => {
              await removeSession(id);
              router.replace('/chat?session=inbox');
              message.success(t('confirmRemoveSessionSuccess'));
            },
            rootClassName: styles.modalRoot,
            title: t('confirmRemoveSessionItemAlert'),
          });
        },
      },
    ],
    [id, pin],
  );

  return (
    <Dropdown
      arrow={false}
      menu={{
        items,
        onClick: ({ domEvent }) => {
          domEvent.stopPropagation();
        },
      }}
      onOpenChange={setOpen}
      trigger={['click']}
    >
      <ActionIcon
        icon={MoreVertical}
        size={{
          blockSize: 28,
          fontSize: 16,
        }}
      />
    </Dropdown>
  );
});

export default Actions;
