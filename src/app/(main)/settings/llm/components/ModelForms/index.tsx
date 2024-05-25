import React, { FC } from 'react';
import { Flexbox } from 'react-layout-kit';
import ModelForm from './ModelForm';

export interface ModelFormsProps {
  models: string[];
}

const ModelForms: FC<ModelFormsProps> = ({ models }) => {
  return (
    <Flexbox gap={10}>
      {models.map((model) => (<ModelForm key={model} model={model} />))}
    </Flexbox>
  );
};

export default ModelForms;
