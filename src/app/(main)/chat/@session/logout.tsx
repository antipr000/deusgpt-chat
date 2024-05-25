'use client';

import { App, Button } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { postMessageToParent } from '@/helpers/iframe.notification';
import { useUserStore } from '@/store/user';

const Logout = () => {
  const { t } = useTranslation('setting');

  const [signOut] = useUserStore((s) => [s.logout]);

  const handleSignOut = useCallback(() => {
    // modal.confirm({
    //   centered: true,
    //   okButtonProps: { danger: true },
    //   onOk: () => {
    //     signOut();
    //     message.success(t('settingSystem.oauth.signout.success'));
    //   },
    //   title: t('settingSystem.oauth.signout.confirm'),
    // });
    signOut();
    postMessageToParent('signout', true);
  }, []);

  return (
    <Button type="primary" onClick={handleSignOut}>
      {t('settingSystem.oauth.signout.action')}
    </Button>
  );
};

export default Logout;
