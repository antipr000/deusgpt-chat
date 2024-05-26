import { Form, ItemGroup } from '@lobehub/ui';
import { Checkbox, FormInstance, Input } from 'antd';
import { createStyles } from 'antd-style';
import React, { FC, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { FORM_STYLE } from '@/const/layoutTokens';
import { GlobalLLMConfig } from '@/types/settings';

import { LLMProviderConfigKey } from '../../const';

export interface ModelFormProps {
  model: string;
  form: FormInstance<any>;
  provider: keyof GlobalLLMConfig;
}

const useStyles = createStyles(({ css, prefixCls, responsive }) => ({
  form: css`
    .${prefixCls}-form-item-control:has(.${prefixCls}-input,.${prefixCls}-select) {
      flex: none;
      width: min(70%, 800px);
      min-width: min(70%, 800px) !important;
    }
    ${responsive.mobile} {
      width: 100%;
      min-width: unset !important;
    }
    .${prefixCls}-select-selection-overflow-item {
      font-size: 12px;
    }
  `,
  safariIconWidthFix: css`
    svg {
      width: unset !important;
    }
  `,
}));

const ModelForm: FC<ModelFormProps> = ({ model, form, provider }) => {
  const { styles } = useStyles();
  const [checkedStandard, setCheckedStandard] = useState<boolean>(false);
  const [checkedPremium, setCheckedPremium] = useState<boolean>(false);

  const onCheckStandard = (value: boolean, type: string) => {
    switch (type) {
      case 'standard': {
        form.setFieldsValue({
          [LLMProviderConfigKey]: {
            [provider]: {
              models: {
                [model]: {
                  standard: value ? 'unlimited' : 0,
                },
              },
            },
          },
        });
        setCheckedStandard(value);
        break;
      }
      case 'premium': {
        form.setFieldsValue({
          [LLMProviderConfigKey]: {
            [provider]: {
              models: {
                [model]: {
                  premium: value ? 'unlimited' : 0,
                },
              },
            },
          },
        });
        setCheckedPremium(value);
        break;
      }
      default: {
        break;
      }
    }
  };

  const formItems = [
    {
      children: <Input disabled={checkedStandard} style={{ width: 100 }} required />,
      label: 'Standard',
      name: [LLMProviderConfigKey, provider, 'models', model, 'standard'],
    },
    {
      children: <Input required disabled={checkedPremium} style={{ width: 100 }} />,
      label: 'Premium',
      name: [LLMProviderConfigKey, provider, 'models', model, 'premium'],
    },
  ];

  const formLayout: ItemGroup = {
    children: formItems,

    title: (
      <Flexbox
        align={'center'}
        className={styles.safariIconWidthFix}
        horizontal
        style={{
          filter: 'grayscale(100%)',
          height: 24,
          maxHeight: 24,
          opacity: 0.66,
        }}
      >
        {model}
      </Flexbox>
    ),
  };

  return (
    <Form
      className={styles.form}
      component="div"
      form={form}
      initialValues={{
        [LLMProviderConfigKey]: {
          [provider]: {
            models: {
              [model]: {
                standard: 0,
                premium: 0,
              },
            },
          },
        },
      }}
      items={[formLayout]}
      // onValuesChange={debounce(setSettings, 100)}
      {...FORM_STYLE}
    />
  );
};

export default ModelForm;
