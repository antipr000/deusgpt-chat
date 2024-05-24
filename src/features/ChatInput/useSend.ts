import { useCallback } from 'react';

import { addUsage } from '@/helpers/api';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { SendMessageParams } from '@/store/chat/slices/message/action';
import { filesSelectors, useFileStore } from '@/store/file';
import { useAtom } from 'jotai';
import { usageAtom } from '@/store/atoms/usage.atom';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';

export type UseSendMessageParams = Pick<
  SendMessageParams,
  'onlyAddUserMessage' | 'isWelcomeQuestion'
>;

export const useSendMessage = () => {
  const [sendMessage, updateInputMessage] = useChatStore((s) => [
    s.sendMessage,
    s.updateInputMessage,
  ]);
  const [_, setUsage] = useAtom(usageAtom);
  const [model] = useAgentStore((s) => [
    agentSelectors.currentAgentModel(s) as string,
  ]);

  return useCallback((params: UseSendMessageParams = {}) => {
    const store = useChatStore.getState();
    if (chatSelectors.isAIGenerating(store)) return;
    if (!store.inputMessage) return;

    const imageList = filesSelectors.imageUrlOrBase64List(useFileStore.getState());

    sendMessage({
      files: imageList,
      message: store.inputMessage,
      ...params,
    }).then(() => {
      addUsage({ model }).then((usage) => {
        setUsage(usage)
      })
    });

    updateInputMessage('');
    useFileStore.getState().clearImageList();
  }, [model]);
};
