'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { fetchTranslation } from '../client/fetcher';
import { useQueryApi } from '../hooks/useQueryApi';
import { ConfigValues, HistoryRecord, LastTranslateData } from '../types';

type GlobalContextValue = {
  configValues: ConfigValues;
  setConfigValues: Dispatch<SetStateAction<ConfigValues>>;
  translator: {
    lastTranslateData: LastTranslateData;
    setLastTranslateData: Dispatch<SetStateAction<LastTranslateData>>;
    translateText: string;
    setTranslateText: Dispatch<SetStateAction<string>>;
    translatedText: string | undefined;
    mutateTranslateText: (data: Parameters<typeof fetchTranslation>[0]) => void;
    isTranslating: boolean;
    isTranslateError: boolean;
  };
  history: {
    historyRecords: HistoryRecord[];
    setHistoryRecords: Dispatch<SetStateAction<HistoryRecord[]>>;
  };
};

const GlobalContext = createContext<GlobalContextValue>({
  configValues: {
    streamEnabled: true,
    currentModel: 'gpt-3.5-turbo',
    temperatureParam: 0.7,
  },
  setConfigValues: () => undefined,
  translator: {
    lastTranslateData: {
      fromLang: 'auto',
      toLang: 'auto',
    },
    setLastTranslateData: () => undefined,
    translateText: '',
    setTranslateText: () => undefined,
    translatedText: undefined,
    mutateTranslateText: () => undefined,
    isTranslating: false,
    isTranslateError: false,
  },
  history: {
    historyRecords: [],
    setHistoryRecords: () => undefined,
  },
});

type Props = {
  children: React.ReactNode;
};

export function GlobalProvider(props: Props) {
  const { children } = props;
  const [translateText, setTranslateText] = useState('');
  const [historyRecords, setHistoryRecords] = useLocalStorage<HistoryRecord[]>(
    'history-record',
    [],
  );
  const [lastTranslateData, setLastTranslateData] = useLocalStorage<LastTranslateData>(
    'last-translate-data',
    {
      fromLang: 'auto',
      toLang: 'auto',
    },
  );
  const [configValues, setConfigValues] = useLocalStorage<ConfigValues>('extra-config', {
    streamEnabled: true,
    currentModel: 'gpt-3.5-turbo',
    temperatureParam: 0.7,
  });
  const {
    streamEnabled = true,
    currentModel = 'gpt-3.5-turbo',
    temperatureParam = 0.7,
  } = configValues;

  const {
    data: translatedText,
    mutate: mutateTranslateText,
    isLoading: isTranslating,
    isError: isTranslateError,
  } = useQueryApi(streamEnabled);

  useEffect(() => {
    if (!translatedText || isTranslating) {
      return;
    }
    setHistoryRecords((prev) => [
      {
        id: self.crypto.randomUUID(),
        fromLanguage: lastTranslateData.fromLang,
        toLanguage: lastTranslateData.toLang,
        text: translateText,
        translation: translatedText,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    // Don't need to catch translateText, lastTranslateData.fromLang, lastTranslateData.toLang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedText, isTranslating, setHistoryRecords]);

  const contextValue = useMemo(
    () => ({
      configValues: { streamEnabled, currentModel, temperatureParam },
      setConfigValues,
      translator: {
        lastTranslateData,
        setLastTranslateData,
        translateText,
        setTranslateText,
        translatedText,
        mutateTranslateText,
        isTranslating,
        isTranslateError,
      },
      history: {
        historyRecords,
        setHistoryRecords,
      },
    }),
    [
      streamEnabled,
      currentModel,
      temperatureParam,
      setConfigValues,
      lastTranslateData,
      setLastTranslateData,
      translateText,
      translatedText,
      mutateTranslateText,
      isTranslating,
      isTranslateError,
      historyRecords,
      setHistoryRecords,
    ],
  );

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}

export function useGlobalStore() {
  return useContext(GlobalContext);
}
