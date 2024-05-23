// import { Icon } from '@lobehub/ui';
import { Dropdown } from 'antd';
import { createStyles } from 'antd-style';
// import type { ItemType } from 'antd/es/menu/interface';
// import isEqual from 'fast-deep-equal';
// import { LucideArrowRight } from 'lucide-react';
// import { useRouter } from 'next/navigation';
import { PropsWithChildren, memo, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Flexbox } from 'react-layout-kit';

import { ModelItemRender } from '@/components/ModelSelect';
// import { useAgentStore } from '@/store/agent';
// import { agentSelectors } from '@/store/agent/slices/chat';
// import { useUserStore } from '@/store/user';
// import { modelProviderSelectors } from '@/store/user/selectors';
// import { ModelProviderCard } from '@/types/llm';
// import { withBasePath } from '@/utils/basePath';
import { useAtomValue } from 'jotai';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { Integration } from '@/app/api/db/types/Integration.type';

const useStyles = createStyles(({ css, prefixCls }) => ({
  menu: css`
    .${prefixCls}-dropdown-menu-item {
      display: flex;
      gap: 8px;
    }
    .${prefixCls}-dropdown-menu {
      &-item-group-title {
        padding-inline: 8px;
      }

      &-item-group-list {
        margin: 0 !important;
      }
    }
  `,
  tag: css`
    cursor: pointer;
  `,
}));

const menuKey = (provider: string, model: string) => `${provider}-${model}`;

const ModelSwitchPanel = memo<PropsWithChildren>(({ children }) => {
  // const { t } = useTranslation('components');
  const { styles } = useStyles();
  const integrations = useAtomValue(integrationsAtom)
  // const [model, provider, updateAgentConfig] = useAgentStore((s) => [
  //   agentSelectors.currentAgentModel(s),
  //   agentSelectors.currentAgentModelProvider(s),
  //   s.updateAgentConfig,
  // ]);

  // const router = useRouter();
  // const enabledList = useUserStore(modelProviderSelectors.modelProviderListForModelSelect, isEqual);

  const items: any = useMemo(() => {
    const getModelItems = (provider: Integration) => {
      const items = provider.models.map((model) => ({
        key: menuKey(provider.name, model.name),
        label: <ModelItemRender {...model} />,
        onClick: () => {
          // updateAgentConfig({ model: model.id, provider: provider.id });
        },
      }));

      return items;
    };

    // otherwise show with provider group
    return integrations?.map((provider) => ({
      children: getModelItems(provider),
      key: provider.name,
      label: provider.displayName,
      type: 'group',
    }));
  }, [integrations]);

  return (
    <Dropdown
      menu={{
        // activeKey: menuKey(provider, model),
        className: styles.menu,
        items,
        style: {
          maxHeight: 500,
          overflowY: 'scroll',
        },
      }}
      placement={'topLeft'}
      trigger={['click']}
    >
      <div className={styles.tag}>{children}</div>
    </Dropdown>
  );
});

export default ModelSwitchPanel;
