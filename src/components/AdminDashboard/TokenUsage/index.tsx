'use client';

import { Card, Col, Row } from 'antd';
import { createStyles } from 'antd-style';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import SkeletonLoading from '@/components/SkeletonLoading';
import { getUsageForDateRange } from '@/helpers/api';

const useStyles = createStyles(({ css }) => ({
  paragraph: css`
    .ant-skeleton-paragraph {
      margin-bottom: 4px !important;
    }
  `,
}));

const startOfToady = new Date();
startOfToady.setHours(0, 0, 0, 0);
const dateBeforeSevenDays = new Date();
dateBeforeSevenDays.setDate(dateBeforeSevenDays.getDate() - 7);
const dateBeforeThirtyDays = new Date();
dateBeforeThirtyDays.setDate(dateBeforeThirtyDays.getDate() - 30);

const promiseArr = [
  getUsageForDateRange(startOfToady),
  getUsageForDateRange(dateBeforeSevenDays),
  getUsageForDateRange(dateBeforeThirtyDays),
];

const TokenUsage = () => {
  const { t } = useTranslation('admin');
  const { styles } = useStyles();

  const [tokenUsage, setTokenUsage] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all(promiseArr).then((data) => {
      setTokenUsage(data);
      setLoading(false);
    });
  }, []);

  const [today, thisWeek, thisMonth] = tokenUsage as [number, number, number];

  return (
    <Flexbox style={{ width: '100%' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold' }}>{t('dashboard.tokenUsage.title')}</h1>

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
