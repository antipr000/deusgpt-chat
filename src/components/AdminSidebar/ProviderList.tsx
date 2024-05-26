import { Azure, Ollama, OpenAI } from '@lobehub/icons';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Flexbox } from 'react-layout-kit';

import { MODELS } from '@/const/models';

import Menu from '../Menu';

const ProviderList = () => {
  const router = useRouter();

  const items = Object.keys(MODELS).map((name: string) => {
    const { Icon, title } = MODELS[name];
    return {
      icon: <Icon size={18} />,
      key: name,
      label: title,
    };
  });

  return (
    <Flexbox style={{ flex: '1 0 auto', height: '100%', padding: '15px', width: '200px' }}>
      <Flexbox align={'center'} gap={4} horizontal>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Providers</div>
      </Flexbox>

      <Menu
        items={items}
        onClick={({ key }) => {
          router.push(`#${key}`);
        }}
        selectable
        selectedKeys={[]}
        style={{ marginTop: '20px' }}
        variant={'compact'}
      />
    </Flexbox>
  );
};

export default ProviderList;
