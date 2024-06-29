'use client';

import { Checkbox } from 'antd';
import { useAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { MouseEventHandler, memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';

import PluginTag from '@/features/PluginStore/PluginItem/PluginTag';
import { updateChatSession } from '@/helpers/api';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
import { useToolStore } from '@/store/tool';
import { customPluginSelectors } from '@/store/tool/selectors';

const ToolItem = memo<{ identifier: string; label: string }>(({ identifier, label }) => {
  const [chatSessions] = useAtom(chatSessionsAtom);
  const [checked, togglePlugin] = useAgentStore((s) => [
    agentSelectors.currentAgentPlugins(s).includes(identifier),
    s.togglePlugin,
  ]);

  const isCustom = useToolStore((s) => customPluginSelectors.isCustomPlugin(identifier)(s));

  const sessionId = useSearchParams().get('session');
  const chatSession = chatSessions.find((s) => s.sessionId === sessionId);

  useEffect(() => {
    if (chatSession?.plugins?.includes(identifier)) {
      togglePlugin(identifier, true);
    } else {
      togglePlugin(identifier, false);
    }
  }, [sessionId]);

  const onClick: MouseEventHandler = async (e) => {
    e.stopPropagation();
    let plugins = [...(chatSession?.plugins || [])];
    if (checked) {
      plugins = plugins.filter((p) => p !== identifier);
    } else {
      plugins.push(identifier);
    }
    togglePlugin(identifier);
    if (sessionId !== 'inbox') {
      chatSession!.plugins = plugins;
      updateChatSession(sessionId!, { plugins });
    }
  };

  return (
    <Flexbox gap={40} horizontal justify={'space-between'} onClick={onClick} padding={'8px 12px'}>
      <Flexbox align={'center'} gap={8} horizontal>
        {label}
        {isCustom && <PluginTag showText={false} type={'customPlugin'} />}
      </Flexbox>
      <Checkbox checked={checked} onClick={onClick} />
    </Flexbox>
  );
});

export default ToolItem;
