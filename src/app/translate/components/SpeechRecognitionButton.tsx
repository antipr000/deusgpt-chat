'use client';

import React, { useCallback, useEffect } from 'react';
import { Button } from 'react-daisyui';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { MdOutlineMicNone, MdStop } from 'react-icons/md';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';

type Props = {
  language: string;
  onChangeTranscript: (newTranscript: string) => void;
} & React.ComponentPropsWithoutRef<typeof Button>;

export function SpeechRecognitionButton(props: Props) {
  const { language, onChangeTranscript, ...restProps } = props;
  const { t } = useTranslation('translate');

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    onChangeTranscript(transcript);
  }, [onChangeTranscript, transcript]);

  const onClickSpeechRecognitionBtn = useCallback(() => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: language === 'wyw' ? 'zh-TW' : language,
      });
      toast.success(t('Recording started.'));
    } else {
      SpeechRecognition.stopListening();
      toast.success(t('Recording stopped.'));
    }
  }, [language, listening, resetTranscript, t]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  // NOTE: This is a workaround for a bug in react-daisyui.
  (restProps as Record<string, unknown>)['type'] = 'button';

  return (
    <Button
      color={listening ? 'error' : 'ghost'}
      onClick={onClickSpeechRecognitionBtn}
      shape="circle"
      size="sm"
      title={listening ? t('Stop speaking') : t('Start speaking')}
      {...restProps}
    >
      {listening ? <MdStop size="16" /> : <MdOutlineMicNone size="16" />}
    </Button>
  );
}
