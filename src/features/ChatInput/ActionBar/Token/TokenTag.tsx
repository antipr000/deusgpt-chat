import { TokenTag, Tooltip } from '@lobehub/ui';
import numeral from 'numeral';
import { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

// import { useTokenCount } from '@/hooks/useTokenCount';
import { useAgentStore } from '@/store/agent';
import { agentSelectors } from '@/store/agent/selectors';
// import { useToolStore } from '@/store/tool';
// import { toolSelectors } from '@/store/tool/selectors';
// import { useUserStore } from '@/store/user';
// import { modelProviderSelectors } from '@/store/user/selectors';
import { useAtom, useAtomValue } from 'jotai';
import { usageAtom } from '@/store/atoms/usage.atom';
import { userAtom } from '@/store/atoms/user.atom';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { getUsage } from '@/helpers/api';

const format = (number: number) => numeral(number).format('0,0');

const Token = memo(() => {
  const { t } = useTranslation('chat');
  const usage = useAtomValue(usageAtom);
  const user = useAtomValue(userAtom);
  const integrations = useAtomValue(integrationsAtom);
  const [_, setUsage] = useAtom(usageAtom);

  // const [input, messageString] = useChatStore((s) => [
  //   s.inputMessage,
  //   chatSelectors.chatsMessageString(s),
  // ]);
  const [systemRole, model, provider] = useAgentStore((s) => [
    agentSelectors.currentAgentSystemRole(s),
    agentSelectors.currentAgentModel(s) as string,
    agentSelectors.currentAgentModelProvider(s) as string,
  ]);

  useEffect(() => {
    getUsage(model).then((usage) => {
      setUsage(usage);
    })
  }, [model])

  // @ts-ignore
  const { availableTokens, maxTokens } = useMemo(() => {
    const integration = integrations?.find(int => int.name === provider);
    if(integration) {
      console.log(integration)

      const storedModel = integration.models.find(m => m.name === model);
      if(storedModel) {
        const isPremium = user?.plan === 'premium';
        const limit = isPremium ? storedModel.limit.premium : storedModel.limit.standard;

        console.log(storedModel, limit, usage)
        if(typeof limit === 'string') {
          return { availableTokens: 'Unlimited', maxTokens: 'Unlimited' };
        } else {
          return { availableTokens: limit - usage, maxTokens: limit, };
        }
      }
    } else {
      return {}
    }
  }, [model, provider, integrations, usage])


  // const maxTokens = useUserStore(modelProviderSelectors.modelMaxToken(model));

  // Tool usage token
  // const canUseTool = useUserStore(modelProviderSelectors.isModelEnabledFunctionCall(model));
  // const plugins = useAgentStore(agentSelectors.currentAgentPlugins);
  // const toolsString = useToolStore((s) => {
  //   const pluginSystemRoles = toolSelectors.enabledSystemRoles(plugins)(s);
  //   const schemaNumber = toolSelectors
  //     .enabledSchema(plugins)(s)
  //     .map((i) => JSON.stringify(i))
  //     .join('');

  //   return pluginSystemRoles + schemaNumber;
  // });
  // const toolsToken = useTokenCount(canUseTool ? toolsString : '');

  // Chat usage token
  // const inputTokenCount = input ? 1 : 0;
  // const messageTokenCount = messageString ? 1 : 0;

  // const chatsToken = messageTokenCount + inputTokenCount;

  // SystemRole token
  // const systemRoleToken = useTokenCount(systemRole);

  // Total token
  // const totalToken = systemRoleToken + toolsToken + chatsToken;

  return (
    <Tooltip
      placement={'bottom'}
      title={
        <Flexbox width={170}>
          {/*<Flexbox horizontal justify={'space-between'}>
            <span>{t('tokenDetails.systemRole')}</span>
            <span>{format(systemRoleToken)}</span>
          </Flexbox>
          <Flexbox horizontal justify={'space-between'}>
            <span>{t('tokenDetails.tools')}</span>
            <span>{format(toolsToken)}</span>
          </Flexbox>
          <Flexbox horizontal justify={'space-between'}>
            <span>{t('tokenDetails.chats')}</span>
            <span>{format(chatsToken)}</span>
          </Flexbox>
          <Flexbox horizontal justify={'space-between'}>
            <span>{t('tokenDetails.used')}</span>
            <span>{format(totalToken)}</span>
          </Flexbox>*/}
          <Flexbox horizontal justify={'space-between'} style={{ marginTop: 8 }}>
            <span>{t('tokenDetails.total')}</span>
            <span>{typeof maxTokens === 'string' ? maxTokens : format(maxTokens)}</span>
          </Flexbox>
          <Flexbox horizontal justify={'space-between'}>
            <span>{t('tokenDetails.rest')}</span>
            <span>{availableTokens}</span>
          </Flexbox>
        </Flexbox>
      }
    >
      <TokenTag
        displayMode={'used'}
        maxValue={typeof maxTokens === 'string' ? Number.MAX_SAFE_INTEGER : maxTokens}
        style={{ marginLeft: 8 }}
        text={{
          overload: t('tokenTag.overload'),
          remained: t('tokenTag.remained'),
          used: t('tokenTag.used'),
        }}
        value={usage}
      />
    </Tooltip>
  );
});

export default Token;
