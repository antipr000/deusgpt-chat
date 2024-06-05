'use client';

import { useTranslation } from 'react-i18next';

// import FullscreenLoading from '@/components/FullscreenLoading';
import Loader from '@/components/Loader';

const Loading = () => {
  const { t } = useTranslation('translate');

  return <Loader message={t('translateInitializing')} show />;
};

export default Loading;
