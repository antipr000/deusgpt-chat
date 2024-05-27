'use client';

import { App, Button, Select, Slider, SliderSingleProps, Switch } from 'antd';
import { useAtomValue } from 'jotai';
import React, { useCallback, useMemo, useState } from 'react';
// import { Toggle } from 'react-daisyui';
// import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// import { FaTimes } from 'react-icons/fa';
import { integrationsAtom } from '@/store/atoms/integrations.atom';

import { useGlobalStore } from '../components/GlobalStore';
// import { OPENAI_MODELS_TITLES } from '../constants';
import { OpenAIModel } from '../types';

const marks: SliderSingleProps['marks'] = {
  '0.4': 0.4,
  '0.5': 0.5,
  '0.6': 0.6,
  '0.7': 0.7,
  '0.8': 0.8,
  '0.9': 0.9,
  '1.0': 1,
};

function ConfigPage() {
  const { message } = App.useApp();

  const { t } = useTranslation('translate');
  const {
    configValues: { streamEnabled, currentModel, temperatureParam },
    setConfigValues,
  } = useGlobalStore();

  const integrations = useAtomValue(integrationsAtom);

  const models: string[] = useMemo(() => {
    return (
      integrations?.flatMap((integration) => integration.models.map((model) => model.name)) || []
    );
  }, [integrations]);

  const [selectedModel, setSelectedModel] = useState<OpenAIModel>(currentModel as OpenAIModel);
  const [isStreamEnabled, setStreamEnabled] = useState(streamEnabled);
  const [tempParam, setTempParam] = useState(temperatureParam);

  const handleSave = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedModel) {
        message.error(t('Please select a model.'));
        return;
      }

      setConfigValues((prev) => ({
        ...prev,
        currentModel: selectedModel,
        streamEnabled: isStreamEnabled,
        temperatureParam: tempParam,
      }));
      message.success(t('Config Saved!'));
    },
    [setConfigValues, t, selectedModel, tempParam, isStreamEnabled],
  );

  return (
    <div className="text-[14px] text-[#080808] p-4 w-full max-w-[100vw] bg-base-100 overflow-y-auto overflow-x-hidden h-full">
      <h1 className="sticky top-0 z-50 flex justify-between w-full font-bold align-middle bg-base-100">
        <span className="text-[25px] leading-[48px] white-text">{t('Config')}</span>
      </h1>
      <form method="post" onSubmit={handleSave}>
        <div className="mb-2 form-control mt-3">
          <label className="label">
            <span className="font-bold label-text">{t('Use stream (typing effect)')}</span>
            <Switch onChange={(value) => setStreamEnabled(value)} value={isStreamEnabled} />
            {/* <Toggle color="primary" defaultChecked={streamEnabled} name="streamEnabled" /> */}
          </label>
        </div>

        <div className="mb-2 form-control mt-3">
          <label className="label">
            <span className="font-bold label-text">{t('Model (engine)')}</span>
          </label>
          <Select
            className="w-full white-text h-[55px]"
            defaultValue={currentModel}
            onChange={(value) => setSelectedModel(value as OpenAIModel)}
            options={models.map((value) => ({
              label: value,
              value,
            }))}
            title="Selected Model"
            value={selectedModel}
          />
        </div>
        <div className="mb-4 form-control mt-4">
          <label className="label flex-col items-start">
            <span className="font-bold label-text">{t('Temperature')}</span>
            <span className="label-text-alt">{t('Higher temperature will be more creative.')}</span>
          </label>

          {/* @ts-ignore */}
          <Slider
            className="mt-5"
            marks={marks}
            max={1}
            min={0.4}
            onChange={(value: number[]) => setTempParam(value[0])}
            range={{ draggableTrack: true }}
            step={0.1}
            value={tempParam}
          />
        </div>
        <div className="form-control mt-6 w-100 flex justify-center">
          <Button htmlType="submit" style={{ alignSelf: 'center', width: '150px' }} type="primary">
            {t('Save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConfigPage;
