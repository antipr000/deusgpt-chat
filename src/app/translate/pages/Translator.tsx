'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { CgArrowsExchange } from 'react-icons/cg';
import { MdClose, MdContentCopy } from 'react-icons/md';
import TextareaAutoSize from 'react-textarea-autosize';
import 'regenerator-runtime/runtime';

import { useGlobalStore } from '../components/GlobalStore';
// import { SpeechRecognitionButton } from '../components/SpeechRecognitionButton';
import { TTSButton } from '../components/TTSButton';
import { LANGUAGES, Language } from '../constants';
import { getTranslatePrompt } from '../utils/prompt';

function TranslatorPage() {
  const { t, i18n } = useTranslation('translate');
  const translateTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const {
    configValues: { openaiApiKey, currentModel, temperatureParam },
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
  } = useGlobalStore();

  useEffect(() => {
    if (!isTranslateError) {
      return;
    }
    toast.error(t('Something went wrong, please try again later.'));
  }, [isTranslateError, t]);

  const onCopyBtnClick = useCallback(() => {
    if (!translatedText) {
      toast.error(t('Nothing to copy!'));
      return;
    }
    navigator.clipboard
      .writeText(translatedText)
      .then(() => {
        toast.success(t('Copied!'));
      })
      .catch(() => {
        toast.error(t('Failed to copy!'));
      });
  }, [t, translatedText]);

  const onExchangeLanguageBtnClick = useCallback(
    () =>
      setLastTranslateData((prev) => ({
        ...prev,
        fromLang: prev.toLang,
        toLang: prev.fromLang,
      })),
    [setLastTranslateData],
  );

  const onChangeTranscript = useCallback(
    (newTranscript: string) => {
      if (!translateTextAreaRef.current || !newTranscript) {
        return;
      }
      translateTextAreaRef.current.value = newTranscript;
      translateTextAreaRef.current.defaultValue = newTranscript;
      setTranslateText(newTranscript);
    },
    [setTranslateText],
  );

  const handleTranslate = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!openaiApiKey) {
        toast.error(t('Please enter your API Key in config page first!'));
        return;
      }

      const formData = new FormData(event.currentTarget);
      const { translateText, fromLang, toLang } = Object.fromEntries(formData.entries());
      if (!translateText || !fromLang || !toLang) {
        return;
      }

      setTranslateText(translateText as string);

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

      setLastTranslateData((prev) => ({
        ...prev,
        fromLang: fromLang as Language,
        toLang: toLang as Language,
      }));

      mutateTranslateText({
        engine: currentModel,
        prompt,
        queryText: translateText as string,
        temperatureParam,
        token: openaiApiKey,
      });
    },
    [
      currentModel,
      i18n.language,
      mutateTranslateText,
      openaiApiKey,
      setLastTranslateData,
      setTranslateText,
      t,
      temperatureParam,
    ],
  );

  const onClearBtnClick = useCallback(() => {
    if (!translateTextAreaRef.current) {
      return;
    }
    translateTextAreaRef.current.value = '';
  }, []);

  // ↑ Hooks before, keep hooks order

  return (
    <form method="post" onSubmit={handleTranslate}>
      <div className="container max-w-screen-2xl xl:mx-auto md:grid md:grid-cols-2 md:gap-4">
        <div className="w-full md:min-h-[calc(100vh_-_112px)] max-w-full p-4 m-0 shadow-md top-16 bg-base-100">
          <div className="flex flex-row mb-4">
            <select
              className="w-5/12 select"
              name="fromLang"
              onChange={(e) =>
                setLastTranslateData((prev) => ({ ...prev, fromLang: e.target.value }))
              }
              required
              title="From Language"
              value={lastTranslateData.fromLang}
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGES[lang as Language]}
                </option>
              ))}
            </select>

            <div className="flex justify-center w-2/12">
              <Button
                color="ghost"
                onClick={onExchangeLanguageBtnClick}
                shape="circle"
                title="Exchange"
                type="button"
              >
                <CgArrowsExchange size={20} />
              </Button>
            </div>

            <select
              className="w-5/12 select"
              name="toLang"
              onChange={(e) =>
                setLastTranslateData((prev) => ({ ...prev, toLang: e.target.value }))
              }
              required
              title="To language"
              value={lastTranslateData.toLang}
            >
              {Object.keys(LANGUAGES).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGES[lang as Language]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <div className="relative">
              <TextareaAutoSize
                className="w-full mb-2 whitespace-pre-line break-words resize-none rounded-2xl textarea textarea-md textarea-primary md:min-h-[120px] pb-10"
                defaultValue={translateText}
                disabled={isTranslating}
                name="translateText"
                onChange={(e) => setTranslateText(e.target.value)}
                placeholder={t('Please enter the text you want to translate here.')}
                ref={translateTextAreaRef}
                required
              ></TextareaAutoSize>
              <div className="absolute flex flex-row justify-between left-0 bottom-5 w-full px-2">
                <div className="flex flex-row justify-start gap-2">
                  {/* <SpeechRecognitionButton
                    language={
                      lastTranslateData.fromLang === 'auto'
                        ? i18n.language
                        : lastTranslateData.fromLang
                    }
                    onChangeTranscript={onChangeTranscript}
                    disabled={isTranslating}
                  /> */}
                  {!!translateText && (
                    <TTSButton
                      language={
                        lastTranslateData.fromLang === 'auto'
                          ? i18n.language
                          : lastTranslateData.fromLang
                      }
                      text={translateText}
                    />
                  )}
                </div>
                {!!translateText && (
                  <Button
                    color="ghost"
                    onClick={onClearBtnClick}
                    shape="circle"
                    size="sm"
                    title="Clear the input"
                    type="button"
                  >
                    <MdClose size="16" />
                  </Button>
                )}
              </div>
            </div>
            <Button
              className="md:hidden"
              color="primary"
              disabled={isTranslating}
              loading={isTranslating}
              type="submit"
            >
              {isTranslating ? t('Translating...') : t('Translate')}
            </Button>
          </div>
        </div>
        <div className="p-4 pb-14 m-0 form-control">
          <Button
            className="hidden mb-4 md:inline-flex"
            color="primary"
            disabled={isTranslating}
            loading={isTranslating}
            type="submit"
          >
            {isTranslating ? t('Translating...') : t('Translate')}
          </Button>
          <div className="relative">
            <TextareaAutoSize
              className={clsx(
                'w-full mb-2 whitespace-pre-line break-words resize-none rounded-2xl textarea textarea-md textarea-ghost md:min-h-[120px]',
                !!translatedText && !isTranslating && 'pb-10',
              )}
              name="translatedText"
              placeholder={
                isTranslating ? t('Please wait...') : t('Translated text will appear here.')
              }
              readOnly
              required
              value={translatedText || ''}
            ></TextareaAutoSize>
            <div className="absolute flex flex-row justify-between left-0 bottom-5 w-full px-2">
              {!!translatedText && (
                <TTSButton
                  language={
                    lastTranslateData.toLang === 'auto' ? i18n.language : lastTranslateData.toLang
                  }
                  text={translatedText || ''}
                />
              )}
              {!!translatedText && !isTranslating && (
                <Button
                  color="ghost"
                  onClick={onCopyBtnClick}
                  shape="circle"
                  size="sm"
                  title={t('Copy translated text')}
                  type="button"
                >
                  <MdContentCopy size="16" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default TranslatorPage;
