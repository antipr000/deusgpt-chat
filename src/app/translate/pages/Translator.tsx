'use client';

import { useCallback, useEffect, useState } from 'react';
import { App, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { MdOutlineSwapHoriz } from 'react-icons/md';
import { TbCopy } from 'react-icons/tb';
import 'regenerator-runtime/runtime';

import { useGlobalStore } from '../components/GlobalStore';
import { LANGUAGES, Language } from '../constants';
import { getTranslatePrompt } from '../utils/prompt';

function TranslatorPage() {
  const { t, i18n } = useTranslation('translate');
  const [isClient, setIsClient] = useState(false);
  const { message } = App.useApp();

  const {
    configValues: { currentModel, temperatureParam },
    translator: {
      lastTranslateData,
      setLastTranslateData,
      translatedText,
      mutateTranslateText,
      isTranslating,
      isTranslateError,
    },
  } = useGlobalStore();

  const [toTranslateText, setToTranslateText] = useState('');

  useEffect(() => {
    if (!isTranslateError) {
      return;
    }
    message.error(t('Something went wrong, please try again later.'));
  }, [isTranslateError, t]);

  const onCopyBtnClick = useCallback(() => {
    if (!translatedText) {
      message.error(t('Nothing to copy!'));
      return;
    }
    navigator.clipboard
      .writeText(translatedText)
      .then(() => {
        message.success(t('Copied!'));
      })
      .catch(() => {
        message.error(t('Failed to copy!'));
      });
  }, [t, translatedText]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onExchangeLanguageBtnClick = useCallback(
    () =>
      setLastTranslateData((prev) => ({
        ...prev,
        fromLang: prev.toLang,
        toLang: prev.fromLang,
      })),
    [setLastTranslateData],
  );

  const handleTranslate = useCallback(
    (event: any) => {
      event.preventDefault();
      const { fromLang, toLang } = lastTranslateData;
      console.log('Here 2', toTranslateText, fromLang, toLang);
      if (!toTranslateText || !fromLang || !toLang) {
        message.error('From and to languages are mandatory!');
        return;
      }

      let prompt: string;

      if (toLang === 'auto') {
        if (i18n.language.startsWith('zh')) {
          prompt = '翻译成简体白话文';
        } else {
          const _toLang = LANGUAGES[i18n.language as Language] || i18n.language;
          prompt = `translate into ${_toLang}`;
        }
      } else {
        prompt = getTranslatePrompt(fromLang as Language, toLang as Language);
      }

      mutateTranslateText({
        engine: currentModel,
        prompt,
        queryText: toTranslateText as string,
        temperatureParam,
      });
    },
    [
      currentModel,
      i18n.language,
      mutateTranslateText,
      toTranslateText,
      lastTranslateData
    ],
  );

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#f5f5f5]">
      <div className="rounded-lg w-full">
        <h1 className="text-2xl font-semibold mb-4 text-center">Translator</h1>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sourceLang">
              Source Language
            </label>
            <select
              className="block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm p-2 outline-none"
              id="sourceLang"
              onChange={(e) =>
                setLastTranslateData((prev) => ({ ...prev, fromLang: e.target.value }))
              }
              value={lastTranslateData.fromLang}
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGES[lang as Language]}
                </option>
              ))}
            </select>
          </div>
          <Button className="mt-6" onClick={onExchangeLanguageBtnClick}>
            <MdOutlineSwapHoriz className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="targetLang">
              Target Language
            </label>
            <select
              className="block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm p-2 outline-none"
              id="targetLang"
              onChange={(e) =>
                setLastTranslateData((prev) => ({ ...prev, toLang: e.target.value }))
              }
              value={lastTranslateData.toLang}
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGES[lang as Language]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="sourceText">
              Source Text
            </label>
            <textarea
              className="block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm p-2 outline-none"
              cols={20}
              id="sourceText"
              onChange={(e) => setToTranslateText(e.target.value)}
              placeholder="Please enter the text you want to translate here."
              rows={7}
              value={toTranslateText}
            />
          </div>
          <div className="flex-1 relative">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="translatedText"
            >
              Translated Text
            </label>
            <textarea
              className="block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm p-2 outline-none bg-gray-100"
              cols={10}
              id="translatedText"
              placeholder="Translated text will appear here."
              readOnly
              rows={7}
              value={translatedText}
            />
            <Button
              className="absolute bottom-4 right-3"
              disabled={!translatedText}
              onClick={onCopyBtnClick}
            >
              <TbCopy className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="text-end">
          <Button className='bg-black text-white' disabled={isTranslating} onClick={handleTranslate}>
            Translate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TranslatorPage;
