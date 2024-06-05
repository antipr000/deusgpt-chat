'use client';

import { useTranslation } from 'react-i18next';

// import FullscreenLoading from '@/components/FullscreenLoading';
import Loader from '@/components/Loader';

const Loading = () => {
  const { t } = useTranslation('admin');

  return <Loader message={t('adminInitializing')} show />;
};

export default Loading;
