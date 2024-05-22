'use client';

import { memo } from 'react';

import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

import SettingButton from '../../../features/SettingButton';
import ShareButton from '../../../features/ShareButton';

const HeaderAction = memo(() => {
  const { isAgentEditable } = useServerConfigStore(featureFlagsSelectors);

  return (
    <>
      <ShareButton />
      {isAgentEditable && <SettingButton />}
    </>
  );
});

export default HeaderAction;
