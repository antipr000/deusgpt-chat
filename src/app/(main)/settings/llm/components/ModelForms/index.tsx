import { FormInstance } from 'antd';
import React, { FC } from 'react';
import { Flexbox } from 'react-layout-kit';

import { GlobalLLMConfig } from '@/types/settings';

import ModelForm from './ModelForm';

export interface ModelFormsProps {
  models: string[];
  form: FormInstance<any>;
  provider: keyof GlobalLLMConfig;
}

const ModelForms: FC<ModelFormsProps> = ({ models, form, provider }) => {
  return (
    <Flexbox gap={10}>
      {models.map((model) => (
        <ModelForm key={model} model={model} form={form} provider={provider} />
      ))}
    </Flexbox>
  );
};

export default ModelForms;
