'use client';

import { useTranslation } from 'react-i18next';

import FullscreenLoading from '@/components/FullscreenLoading';

const Loading = () => {
  const { t } = useTranslation('admin');

  return <FullscreenLoading title={t('adminInitializing')} />;
};

export default Loading;
