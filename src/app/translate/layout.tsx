'use client';

import React, { ReactNode } from 'react';

import '@/styles/global.css';

import { GlobalProvider } from './components/GlobalStore';
import { GlobalToaster } from './components/GlobalToaster';
import { ReactQueryProvider } from './components/ReactQueryProvider';

const TranslateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <GlobalProvider>
        <GlobalToaster />
        <div className="flex" style={{ width: '100% ' }}>
          <div style={{ flex: '1 0 auto' }}>{children}</div>
        </div>
      </GlobalProvider>
    </ReactQueryProvider>
  );
};

export default TranslateLayout;
