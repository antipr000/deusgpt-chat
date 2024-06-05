'use client';

import { useTranslation } from 'react-i18next';

// import FullscreenLoading from '@/components/FullscreenLoading';
import Loader from '@/components/Loader';

const Loading = () => {
  const { t } = useTranslation('common');

  return <Loader message={t('appInitializing')} show />;
};

export default Loading;
