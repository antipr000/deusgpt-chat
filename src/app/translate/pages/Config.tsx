'use client';

import { Select } from 'antd';
import { Button } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useMemo, useState } from 'react';
import { Toggle } from 'react-daisyui';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { translateSidebarAtom } from '@/store/atoms/translate.sidebar.atom';

import { useGlobalStore } from '../components/GlobalStore';
import { OPENAI_MODELS_TITLES } from '../constants';
import { OpenAIModel } from '../types';

function ConfigPage() {
  const { t } = useTranslation('translate');
  const [_, setShowSidebar] = useAtom(translateSidebarAtom);
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

  const handleSave = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const { streamEnabled, temperatureParam } = Object.fromEntries(formData.entries());
      if (!selectedModel) {
        toast.error(t('Please select a model.'));
        return;
      }
      setConfigValues((prev) => ({
        ...prev,
        currentModel: selectedModel,
        streamEnabled: streamEnabled === 'on',
        temperatureParam: +temperatureParam,
      }));
      toast.success(t('Config Saved!'));
      setShowSidebar(false);
    },
    [setConfigValues, t],
  );

  return (
    <div className="p-4 w-[28.75rem] max-w-[100vw] bg-base-100 overflow-y-auto overflow-x-hidden h-full">
      <h1 className="sticky top-0 z-50 flex justify-between w-full text-2xl font-bold align-middle bg-base-100">
        <span className="leading-[48px] white-text">{t('Config')}</span>
        <label
          className="drawer-button btn btn-primary btn-ghost btn-circle white-text"
          htmlFor="history-record-drawer"
          title={t('Close')}
          onClick={() => setShowSidebar((prevState) => !prevState)}
        >
          <FaTimes size={20} />
        </label>
      </h1>
      <form method="post" onSubmit={handleSave}>
        <div className="mb-2 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('Use stream (typing effect)')}</span>
            <Toggle color="primary" defaultChecked={streamEnabled} name="streamEnabled" />
          </label>
        </div>

        <div className="mb-2 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('Model (engine)')}</span>
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
        <div className="mb-4 form-control">
          <label className="label">
            <span className="text-lg font-bold label-text">{t('Temperature')}</span>
            <span className="label-text-alt">{t('Higher temperature will be more creative.')}</span>
          </label>
          <input
            className="range range-primary"
            defaultValue={temperatureParam}
            max="1.0"
            min="0.4"
            name="temperatureParam"
            step="0.1"
            type="range"
          />
          <div className="flex white-text justify-between w-full pl-0 pr-1 text-xs">
            <span>rad</span>
            <span>0.5</span>
            <span>0.6</span>
            <span>0.7</span>
            <span>0.8</span>
            <span>0.9</span>
            <span>1.0</span>
          </div>
        </div>
        <div className="form-control w-100 flex justify-center">
          <Button type="primary" style={{ width: '150px', alignSelf: 'center' }} htmlType="submit">
            {t('Save')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ConfigPage;
