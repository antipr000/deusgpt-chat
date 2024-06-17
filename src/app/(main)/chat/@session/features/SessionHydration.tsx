'use client';

import { useAtom } from 'jotai';
import { debounce } from 'lodash';
import { useQueryState } from 'nuqs';
import { parseAsString } from 'nuqs/server';
import { memo, useCallback, useEffect } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { getAllChatSessions, updateChatSession } from '@/helpers/api';
import { useAgentStore } from '@/store/agent';
import { chatSessionsAtom } from '@/store/atoms/chatSessions.atom';
import { store } from '@/store/atoms/store.atom';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { useSessionStore } from '@/store/session';
import { ChatMessage } from '@/types/message';

// sync outside state to useSessionStore
const SessionHydration = memo(() => {
  const useStoreUpdater = createStoreUpdater(useSessionStore);
  const useAgentStoreUpdater = createStoreUpdater(useAgentStore);
  const useChatStoreUpdater = createStoreUpdater(useChatStore);
  const [switchTopic, updateInitialMessagesMap, toggleIsLoading] = useChatStore((s) => [
    s.switchTopic,
    s.updateInitialMessagesMap,
    s.toggleIsLoading,
  ]);
  const [chatSessions] = useAtom(chatSessionsAtom);

  // two-way bindings the url and session store
  const [session, setSession] = useQueryState(
    'session',
    parseAsString.withDefault('inbox').withOptions({ history: 'replace', throttleMs: 50 }),
  );
  useStoreUpdater('activeId', session);
  useAgentStoreUpdater('activeId', session);
  useChatStoreUpdater('activeId', session);
  const [currentChats, initialMessagesMap] = useChatStore((s) => [
    chatSelectors.currentChats(s),
    s.initialMessagesMap,
  ]);

  useEffect(() => {
    const unsubscribe = useSessionStore.subscribe(
      (s) => s.activeId,
      (state) => {
        switchTopic();
        setSession(state);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const map: Record<string, ChatMessage[]> = {};
    chatSessions.forEach((chatSession) => {
      map[chatSession.sessionId] =
        chatSession?.messages?.map((message) => JSON.parse(message)) || [];
    });

    updateInitialMessagesMap(map);
  }, [chatSessions]);

  const debouncedUpdateChatSession = useCallback(
    debounce(async (currentChats: ChatMessage[]) => {
      await updateChatSession(session, {
        messages: currentChats.map((chat) => JSON.stringify(chat)),
      });
    }, 2000),
    [session],
  );

  useEffect(() => {
    debouncedUpdateChatSession([...(initialMessagesMap[session] || []), ...currentChats]);
  }, [currentChats]);

  useEffect(() => {
    toggleIsLoading(true);
    getAllChatSessions().then((sessions) => {
      store.set(chatSessionsAtom, () => sessions);
      toggleIsLoading(false);
    });
  }, [session]);

  return null;
});

export default SessionHydration;
