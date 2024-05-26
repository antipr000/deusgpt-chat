'use client';

import { Form, type FormItemProps, type ItemGroup } from '@lobehub/ui';
import { Button, Flex, Input, Switch } from 'antd';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { useAtom, useAtomValue } from 'jotai';
import { debounce } from 'lodash-es';
import { MouseEventHandler, ReactNode, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { useSyncSettings } from '@/app/(main)/settings/hooks/useSyncSettings';
import {
  LLMProviderApiTokenKey,
  LLMProviderBaseUrlKey,
  LLMProviderConfigKey,
  LLMProviderModelListKey,
} from '@/app/(main)/settings/llm/const';
import { FORM_STYLE } from '@/const/layoutTokens';
import { MODELS } from '@/const/models';
import { updateIntegration } from '@/helpers/api';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { useUserStore } from '@/store/user';
import { modelConfigSelectors, modelProviderSelectors } from '@/store/user/selectors';
import { GlobalLLMProviderKey } from '@/types/settings';

import Checker from '../Checker';
import ModelForms from '../ModelForms';
import ProviderModelListSelect from '../ProviderModelList';

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
    .ant-form-item-row {
      align-items: flex-start !important;
    }
  `,
  safariIconWidthFix: css`
    svg {
      width: unset !important;
    }
  `,
}));

interface ProviderConfigProps {
  apiKeyItems?: FormItemProps[];
  canDeactivate?: boolean;
  checkModel?: string;
  checkerItem?: FormItemProps;
  modelList?: {
    azureDeployName?: boolean;
    notFoundContent?: ReactNode;
    placeholder?: string;
    showModelFetcher?: boolean;
  };
  provider: GlobalLLMProviderKey;
  proxyUrl?:
    | {
        desc?: string;
        placeholder: string;
        title?: string;
      }
    | false;
  showApiKey?: boolean;
  showBrowserRequest?: boolean;
  title: ReactNode;
}

const ProviderConfig = memo<ProviderConfigProps>(
  ({
    apiKeyItems,
    provider,
    proxyUrl,
    showApiKey = true,
    checkModel,
    canDeactivate = true,
    title,
    checkerItem,
    modelList,
    showBrowserRequest,
  }) => {
    const { t } = useTranslation('setting');
    const { t: modelT } = useTranslation('modelProvider');
    const [form] = Form.useForm();
    const { styles } = useStyles();
    const [loading, setLoading] = useState(false);
    const [setSettings, isFetchOnClient, isProviderEndpointNotEmpty] = useUserStore((s) => [
      s.setSettings,
      modelConfigSelectors.isProviderFetchOnClient(provider)(s),
      modelConfigSelectors.isProviderEndpointNotEmpty(provider)(s),
    ]);

    const enabledModels = useUserStore(
      modelProviderSelectors.getEnableModelsById(provider),
      isEqual,
    );

    const integrations = useAtomValue(integrationsAtom);
    const [_, setIntegrations] = useAtom(integrationsAtom);

    const currentIntegration = useMemo(() => {
      return integrations?.find((integration) => integration?.name === provider);
    }, [integrations]);

    const [enabled, setEnabled] = useState(currentIntegration?.enabled);

    const initialValue = useMemo(() => {
      return {
        [LLMProviderConfigKey]: {
          [provider]: {
            [LLMProviderApiTokenKey]: currentIntegration?.secret,
            [LLMProviderModelListKey]: currentIntegration?.models.map((model) => model.name),
            models: currentIntegration?.models.reduce(
              (acc, model) => ({
                ...acc,
                [model.name]: model.limit,
              }),
              {},
            ),
          },
        },
      };
    }, [currentIntegration]);

    useSyncSettings(form);

    const save = async (event: MouseEvent): Promise<void> => {
      event.stopPropagation();
      const providerConfigs = form.getFieldsValue()[LLMProviderConfigKey][provider];
      const selectedModels = providerConfigs['enabledModels'];

      const modelConfigs = selectedModels.map((modelName: string) => {
        let standardLimit = providerConfigs['models'][modelName]['standard'];
        let premiumLimit = providerConfigs['models'][modelName]['premium'];

        if (standardLimit !== 'unlimited') {
          standardLimit = parseInt(standardLimit);
        }

        if (premiumLimit !== 'unlimited') {
          premiumLimit = parseInt(premiumLimit);
        }

        return {
          name: modelName,
          limit: {
            standard: standardLimit,
            premium: premiumLimit,
          },
        };
      });

      const finalData = {
        name: provider,
        displayName: MODELS[provider]['title'],
        enabled: enabled,
        secret: providerConfigs[LLMProviderApiTokenKey],
        models: modelConfigs,
      };

      if (!finalData.secret) {
        window.alert('Secret is required for enabling the model');
      } else {
        setLoading(true);
        const updatedIntegration = await updateIntegration(finalData);
        const others = integrations?.filter((integration) => integration.name !== provider) || [];

        setIntegrations((_) => [...others, updatedIntegration]);
        setLoading(false);
      }
    };

    // const toggleProviderEnabled = async (enabled: boolean) => {
    //   setLoading(true);
    //   const updatedIntegration = await updateIntegration({
    //     name: provider,
    //     displayName: MODELS[provider]['title'],
    //     enabled: enabled,
    //   });
    //   const others = integrations?.filter((integration) => integration.name !== provider) || [];

    //   setIntegrations((_) => [...others, updatedIntegration]);
    //   setLoading(false);
    // };

    const apiKeyItem: FormItemProps[] = !showApiKey
      ? []
      : apiKeyItems ?? [
          {
            children: (
              <Input.Password
                autoComplete={'new-password'}
                placeholder={modelT(`${provider}.token.placeholder` as any)}
                required
              />
            ),
            desc: modelT(`${provider}.token.desc` as any),
            label: modelT(`${provider}.token.title` as any),
            name: [LLMProviderConfigKey, provider, LLMProviderApiTokenKey],
          },
        ];

    const showEndpoint = !!proxyUrl;
    const formItems = [
      ...apiKeyItem,
      showEndpoint && {
        children: <Input allowClear placeholder={proxyUrl?.placeholder} />,
        desc: proxyUrl?.desc || t('llm.proxyUrl.desc'),
        label: proxyUrl?.title || t('llm.proxyUrl.title'),
        name: [LLMProviderConfigKey, provider, LLMProviderBaseUrlKey],
      },
      (showBrowserRequest || (showEndpoint && isProviderEndpointNotEmpty)) && {
        children: (
          <Switch
            onChange={(enabled) => {
              setSettings({ [LLMProviderConfigKey]: { [provider]: { fetchOnClient: enabled } } });
            }}
            value={isFetchOnClient}
          />
        ),
        desc: t('llm.fetchOnClient.desc'),
        label: t('llm.fetchOnClient.title'),
        minWidth: undefined,
      },
      {
        children: (
          <ProviderModelListSelect
            notFoundContent={modelList?.notFoundContent}
            placeholder={modelList?.placeholder ?? t('llm.modelList.placeholder')}
            provider={provider}
            showAzureDeployName={modelList?.azureDeployName}
            showModelFetcher={modelList?.showModelFetcher}
          />
        ),
        desc: t('llm.modelList.desc'),
        label: t('llm.modelList.title'),
        name: [LLMProviderConfigKey, provider, LLMProviderModelListKey],
      },
      checkerItem ?? {
        children: <Checker model={checkModel!} provider={provider} />,
        desc: t('llm.checker.desc'),
        label: t('llm.checker.title'),
        minWidth: undefined,
      },
      {
        children: <ModelForms models={enabledModels || []} form={form} provider={provider} />,
        desc: 'Set the limits for each model',
        label: 'Limits',
      },
    ].filter(Boolean) as FormItemProps[];

    const model: ItemGroup = {
      children: formItems,

      defaultActive: canDeactivate ? enabled : undefined,
      extra: canDeactivate ? (
        <Flex gap={'8px'} align="center">
          <Switch onChange={setEnabled} disabled={loading} value={enabled} />

          <Button type="primary" size="small" onClick={save} loading={loading}>
            Save
          </Button>
        </Flex>
      ) : undefined,
      title: (
        <Flexbox
          align={'center'}
          className={styles.safariIconWidthFix}
          horizontal
          id={provider}
          style={{
            height: 24,
            maxHeight: 24,
            ...(enabled ? {} : { filter: 'grayscale(100%)', maxHeight: 24, opacity: 0.66 }),
          }}
        >
          {title}
        </Flexbox>
      ),
    };

    return (
      <Form
        className={styles.form}
        form={form}
        items={[model]}
        initialValues={initialValue}
        onValuesChange={debounce(setSettings, 100)}
        {...FORM_STYLE}
      />
    );
  },
);

export default ProviderConfig;
