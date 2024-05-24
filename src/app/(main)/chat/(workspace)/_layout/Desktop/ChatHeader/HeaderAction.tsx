'use client';

import { memo } from 'react';

import ModelSwitch from '@/features/ChatInput/ActionBar/ModelSwitch';
// import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

// import SettingButton from '../../../features/SettingButton';
import ShareButton from '../../../features/ShareButton';
import Tags from './Tags';

const HeaderAction = memo(() => {
  // const { isAgentEditable } = useServerConfigStore(featureFlagsSelectors);

  return (
    <>
      <Tags />
      <ModelSwitch />
      <ShareButton />
    </>
  );
});

export default HeaderAction;
