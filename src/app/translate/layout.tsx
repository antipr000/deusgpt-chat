'use client';

import React, { ReactNode } from 'react';
import { Flexbox } from 'react-layout-kit';

import '@/styles/global.css';

import { GlobalProvider } from './components/GlobalStore';
import { GlobalToaster } from './components/GlobalToaster';
import { ReactQueryProvider } from './components/ReactQueryProvider';

const TranslateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <GlobalProvider>
        <GlobalToaster />
        <Flexbox direction="horizontal" style={{ width: '100% ' }}>
          <Flexbox style={{ flex: '1 0 auto' }}>
            {children}
          </Flexbox>
        </Flexbox>
      </GlobalProvider>
    </ReactQueryProvider>
  );
};

export default TranslateLayout;
