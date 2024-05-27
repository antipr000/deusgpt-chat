'use client';

import { useTranslation } from 'react-i18next';

import FullscreenLoading from '@/components/FullscreenLoading';

const Loading = () => {
  const { t } = useTranslation('translate');

  return <FullscreenLoading title={t('translateInitializing')} />;
};

export default Loading;
