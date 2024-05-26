'use client';

import { Card, Col, Row, Select, SelectProps, Skeleton } from 'antd';
import { createStyles } from 'antd-style';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import SkeletonLoading from '@/components/SkeletonLoading';
import { getAllIntegrations } from '@/helpers/api';
import { integrationsAtom } from '@/store/atoms/integrations.atom';
import { Integration, Model } from '@/types/common/Integration.type';

import useTokenUsage from './useTokenUsage';

const useStyles = createStyles(({ css }) => ({
  paragraph: css`
    .ant-skeleton-paragraph {
      margin-bottom: 4px !important;
    }
  `,
}));

const TokenUsage = () => {
  const { t } = useTranslation('admin');
  const { styles } = useStyles();

  const [integrations, setIntegrations] = useAtom(integrationsAtom);
  const [models, setModels] = useState<SelectProps['options']>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const [loading, tokenUsage] = useTokenUsage(selectedModels);

  const initialize = async () => {
    let integrationsData: Integration[];
    if (!integrations?.length) {
      integrationsData = await getAllIntegrations();
      setIntegrations(integrationsData);
    } else {
      integrationsData = integrations;
    }

    const modelArr: Model[] = [];
    integrationsData.forEach((integration) => {
      modelArr.push(...integration.models);
    });
    setModels(
      modelArr.map((model) => ({
        label: model.name,
        value: model.name,
      })),
    );
    setSelectedModels([modelArr[0].name]);
  };

  useEffect(() => {
    initialize();
  }, []);

  const [today, thisWeek, thisMonth] = tokenUsage as [number, number, number];

  const handleChange = (value: string[]) => {
    setSelectedModels(value);
  };

  return (
    <Flexbox style={{ width: '100%' }}>
      <Flexbox gap={50} horizontal>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold' }}>{t('dashboard.tokenUsage.title')}</h1>
        {!models?.length ? (
          <Skeleton.Input active style={{ marginTop: '9px', width: '300px' }} />
        ) : (
          <Flexbox style={{ marginTop: '9px', width: '300px' }}>
            <Select
              allowClear
              mode="multiple"
              onChange={handleChange}
              options={models}
              placeholder="Please select"
              style={{ width: '100%' }}
              value={selectedModels}
            />
          </Flexbox>
        )}
      </Flexbox>

      <Row gutter={30} style={{ marginTop: '25px' }}>
        <Col span={5}>
          <Card title={t('dashboard.tokenUsage.today')}>
            {loading ? (
              <SkeletonLoading className={styles.paragraph} paragraph={{ rows: 1 }} title={false} />
            ) : (
              today
            )}
          </Card>
        </Col>
        <Col span={5}>
          <Card title={t('dashboard.tokenUsage.thisWeek')}>
            {loading ? (
              <SkeletonLoading className={styles.paragraph} paragraph={{ rows: 1 }} title={false} />
            ) : (
              thisWeek
            )}
          </Card>
        </Col>
        <Col span={5}>
          <Card title={t('dashboard.tokenUsage.thisMonth')}>
            {loading ? (
              <SkeletonLoading className={styles.paragraph} paragraph={{ rows: 1 }} title={false} />
            ) : (
              thisMonth
            )}
          </Card>
        </Col>
      </Row>
    </Flexbox>
  );
};

export default TokenUsage;
