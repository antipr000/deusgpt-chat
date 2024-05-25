import { Input, Modal, type ModalProps } from '@lobehub/ui';
import { App } from 'antd';
import { useAtom } from 'jotai';
import { MouseEvent, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { updateChatSession } from '@/helpers/api';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
// import { useGlobalStore } from '@/store/global';
import { useSessionStore } from '@/store/session';

interface RenameChatSessionProps extends ModalProps {
  id: string;
  initialValue: string | undefined;
}

const RenameChatSessionModal = memo<RenameChatSessionProps>(
  ({ id, initialValue, open, onCancel }: RenameChatSessionProps) => {
    const { t } = useTranslation('chat');

    // const toggleExpandSessionGroup = useGlobalStore((s) => s.toggleExpandSessionGroup);
    const { message } = App.useApp();
    // const [updateSessionGroup, addCustomGroup] = useSessionStore((s) => [
    //   s.updateSessionGroupId,
    //   s.addSessionGroup,
    // ]);
    const [updateAgentMeta] = useSessionStore((s) => [s.updateSessionMeta]);
    const [input, setInput] = useState(initialValue || '');
    const [loading, setLoading] = useState(false);
    const [chatSessions, setChatSessions] = useAtom(chatSessionsAtom);

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Modal
          allowFullscreen
          destroyOnClose
          okButtonProps={{ loading }}
          onCancel={(e) => {
            setInput('');
            onCancel?.(e);
          }}
          onOk={async (e: MouseEvent<HTMLButtonElement>) => {
            if (!input) return;

            if (input.length === 0 || input.length > 20)
              return message.warning(t('sessionGroup.tooLong'));

            setLoading(true);

            await updateChatSession(id, { name: input });
            const session = chatSessions.find((session) => session.sessionId === id)!;
            session.name = input;
            setChatSessions([...chatSessions]);
            updateAgentMeta({ title: input });

            setLoading(false);

            message.success('Chat session renamed successfully');
            onCancel?.(e);
          }}
          open={open}
          title={t('sessionGroup.rename')}
          width={400}
        >
          <Flexbox paddingBlock={16}>
            <Input
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              placeholder="Rename Chat Session"
              value={input}
            />
          </Flexbox>
        </Modal>
      </div>
    );
  },
);

export default RenameChatSessionModal;
