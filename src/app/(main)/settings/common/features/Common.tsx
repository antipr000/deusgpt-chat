'use client';

import { Form, type ItemGroup } from '@lobehub/ui';
import { App, Button, Input } from 'antd';
import isEqual from 'fast-deep-equal';
import { useAtom, useAtomValue } from 'jotai';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSyncSettings } from '@/app/(main)/settings/hooks/useSyncSettings';
import { FORM_STYLE } from '@/const/layoutTokens';
import { DEFAULT_SETTINGS } from '@/const/settings';
import { updateUser } from '@/helpers/api';
import { userAtom } from '@/store/atoms/user.atom';
import { useChatStore } from '@/store/chat';
import { useFileStore } from '@/store/file';
import { useServerConfigStore } from '@/store/serverConfig';
import { serverConfigSelectors } from '@/store/serverConfig/selectors';
import { useSessionStore } from '@/store/session';
import { useToolStore } from '@/store/tool';
import { useUserStore } from '@/store/user';
import { settingsSelectors, userProfileSelectors } from '@/store/user/selectors';

type SettingItemGroup = ItemGroup;

const Common = memo(() => {
  const { t } = useTranslation('setting');
  const [form] = Form.useForm();

  const isSignedIn = useUserStore((s) => s.isSignedIn);
  const showAccessCodeConfig = useServerConfigStore(serverConfigSelectors.enabledAccessCode);
  const showOAuthLogin = useServerConfigStore(serverConfigSelectors.enabledOAuthSSO);
  const user = useUserStore(userProfileSelectors.userProfile, isEqual);

  const [clearSessions, clearSessionGroups] = useSessionStore((s) => [
    s.clearSessions,
    s.clearSessionGroups,
  ]);
  const [clearTopics, clearAllMessages] = useChatStore((s) => [
    s.removeAllTopics,
    s.clearAllMessages,
  ]);
  const [removeAllFiles] = useFileStore((s) => [s.removeAllFiles]);
  const removeAllPlugins = useToolStore((s) => s.removeAllPlugins);
  const settings = useUserStore(settingsSelectors.currentSettings, isEqual);
  const [setSettings, resetSettings, signIn, signOut] = useUserStore((s) => [
    s.setSettings,
    s.resetSettings,
    s.openLogin,
    s.logout,
  ]);

  const { message, modal } = App.useApp();

  const userData = useAtomValue(userAtom);
  const [_, setUser] = useAtom(userAtom);

  const handleSignOut = useCallback(() => {
    modal.confirm({
      centered: true,
      okButtonProps: { danger: true },
      onOk: () => {
        signOut();
        message.success(t('settingSystem.oauth.signout.success'));
      },
      title: t('settingSystem.oauth.signout.confirm'),
    });
  }, []);

  const handleSignIn = useCallback(() => {
    signIn();
  }, []);

  // const handleReset = useCallback(() => {
  //   modal.confirm({
  //     centered: true,
  //     okButtonProps: { danger: true },
  //     onOk: () => {
  //       resetSettings();
  //       form.setFieldsValue(DEFAULT_SETTINGS);
  //       message.success(t('danger.reset.success'));
  //     },
  //     title: t('danger.reset.confirm'),
  //   });
  // }, []);

  // const handleClear = useCallback(() => {
  //   modal.confirm({
  //     centered: true,
  //     okButtonProps: {
  //       danger: true,
  //     },
  //     onOk: async () => {
  //       await clearSessions();
  //       await removeAllPlugins();
  //       await clearTopics();
  //       await removeAllFiles();
  //       await clearAllMessages();
  //       await clearSessionGroups();

  //       message.success(t('danger.clear.success'));
  //     },
  //     title: t('danger.clear.confirm'),
  //   });
  // }, []);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const firstName = form.getFieldValue('firstName');
    const lastName = form.getFieldValue('lastName');

    const updatedData = await updateUser({
      firstName,
      lastName,
    });

    setUser((_) => updatedData);
    setLoading(false);
  };

  const system: SettingItemGroup = {
    children: [
      {
        children: (
          <Input
            autoComplete={'first-name'}
            placeholder={t('settingSystem.firstName.placeholder')}
          />
        ),
        desc: t('settingSystem.firstName.desc'),
        label: t('settingSystem.firstName.title'),
        name: 'firstName',
      },
      {
        children: (
          <Input
            autoComplete={'last-name'}
            placeholder={t('settingSystem.lastName.placeholder')}
            value={userData?.lastName}
          />
        ),
        desc: t('settingSystem.lastName.desc'),
        label: t('settingSystem.lastName.title'),
        name: 'lastName',
      },
      {
        children: (
          <Button onClick={handleSave} type="primary" loading={loading}>
            {t('danger.save.action')}
          </Button>
        ),
        minWidth: undefined,
      },
      // {
      //   children: isSignedIn ? (
      //     <Button onClick={handleSignOut}>{t('settingSystem.oauth.signout.action')}</Button>
      //   ) : (
      //     <Button onClick={handleSignIn} type="primary">
      //       {t('settingSystem.oauth.signin.action')}
      //     </Button>
      //   ),
      //   desc: isSignedIn
      //     ? `${user?.email} ${t('settingSystem.oauth.info.desc')}`
      //     : t('settingSystem.oauth.signin.desc'),
      //   hidden: !showOAuthLogin,
      //   label: isSignedIn
      //     ? t('settingSystem.oauth.info.title')
      //     : t('settingSystem.oauth.signin.title'),
      //   minWidth: undefined,
      // },
      // {
      //   children: (
      //     <Button danger onClick={handleReset} type="primary">
      //       {t('danger.reset.action')}
      //     </Button>
      //   ),
      //   desc: t('danger.reset.title'),
      //   label: t('danger.reset.desc'),
      //   minWidth: undefined,
      // },
      // {
      //   children: (
      //     <Button danger onClick={handleClear} type="primary">
      //       {t('danger.clear.action')}
      //     </Button>
      //   ),
      //   desc: t('danger.clear.desc'),
      //   label: t('danger.clear.title'),
      //   minWidth: undefined,
      // },
    ],
    title: t('settingSystem.title'),
  };

  useSyncSettings(form);

  return (
    <Form
      form={form}
      initialValues={{
        ...settings,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
      }}
      items={[system]}
      itemsType={'group'}
      onValuesChange={setSettings}
      variant={'pure'}
      {...FORM_STYLE}
    />
  );
});

export default Common;
