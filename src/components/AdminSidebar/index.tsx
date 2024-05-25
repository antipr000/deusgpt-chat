'use client';

import { Icon } from '@lobehub/ui';
import { BarChartIcon, Brain, DollarSign } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Flexbox } from 'react-layout-kit';

import Menu from '../Menu';

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    {
      icon: <Icon icon={Brain} />,
      key: 'models',
      label: 'Language Models',
    },
    {
      icon: <Icon icon={BarChartIcon} />,
      key: 'dashboard',
      label: 'Dashboard',
    },
    {
      icon: <Icon icon={DollarSign} />,
      key: 'payments',
      label: 'Payments',
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
