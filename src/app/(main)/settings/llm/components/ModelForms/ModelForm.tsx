import { Form, ItemGroup } from '@lobehub/ui';
import { Checkbox, Input } from 'antd';
import { createStyles } from 'antd-style';
import React, { FC } from 'react';
import { Flexbox } from 'react-layout-kit';

import { FORM_STYLE } from '@/const/layoutTokens';

export interface ModelFormProps {
  model: string;
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

const ModelForm: FC<ModelFormProps> = ({ model }) => {
  const { styles } = useStyles();
  const [standard, setStandard] = React.useState<number | string>(0);
  const [premium, setPremium] = React.useState<number | string>(0);

  const onCheckStandard = (value: boolean, type: string) => {
    switch (type) {
        case 'standard': {
            setStandard(value ? 'unlimited' : 0);
            break;
        }
        case 'premium': {
            setPremium(value ? 'unlimited' : 0);
            break;
        }
        default: {
            break;
        }
    }
  }

  const formItems = [
    {
      children: (
        <Flexbox align='center' gap={10} horizontal justify='flex-end'>
          <Input
            disabled={standard === 'unlimited'}
            onChange={(e) => setStandard(e.target.value)}
            style={{ width: 100 }}
            value={standard}
          />
          <Checkbox onChange={(e) => onCheckStandard(e.target.checked, 'standard')}>Unlimited</Checkbox>
        </Flexbox>
      ),
      label: 'Standard',
      name: 'standard',
    },
    {
      children: (
        <Flexbox align='center' gap={10} horizontal justify='flex-end'>
          <Input 
            disabled={premium === 'unlimited'}
            onChange={(e) => setPremium(e.target.value)}
            style={{ width: 100 }}
            value={premium}
          />
          <Checkbox onChange={(e) => onCheckStandard(e.target.checked, 'premium')}>Unlimited</Checkbox>
        </Flexbox>
      ),
      label: 'Premium',
      name: 'premium',
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
      // form={form}
      items={[formLayout]}
      // onValuesChange={debounce(setSettings, 100)}
      {...FORM_STYLE}
    />
  );
};

export default ModelForm;
