'use client';

import { Icon } from '@lobehub/ui';
import { BarChartIcon, Brain, DollarSign, Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import Menu from '../Menu';

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation('admin');

  const items = [
    {
      icon: <Icon icon={Brain} />,
      key: 'models',
      label: t('sidebar.languageModels'),
    },
    {
      icon: <Icon icon={BarChartIcon} />,
      key: 'dashboard',
      label: t('sidebar.dashboard'),
    },
    {
      icon: <Icon icon={Users} />,
      key: 'members',
      label: t('sidebar.members'),
    },
    {
      icon: <Icon icon={DollarSign} />,
      key: 'payments',
      label: t('sidebar.payments'),
    },
  ];

  const activeKey = items.find((item) => pathname.includes(item.key))?.key as string;

  return (
    <Flexbox style={{ height: '100%', padding: '15px 0 15px 15px', width: 220 }}>
      <Flexbox align={'center'} gap={4} horizontal>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>DeusGPT</div>
      </Flexbox>

      <Menu
        items={items}
        onClick={({ key }) => {
          router.push(`/admin/${key}`);
        }}
        selectable
        selectedKeys={[activeKey]}
        style={{ marginTop: '20px' }}
        variant={'compact'}
      />
    </Flexbox>
  );
};

export default AdminSidebar;
