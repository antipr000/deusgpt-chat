'use client';

import React, { ReactNode } from 'react';

import '@/styles/global.css';

import ConfigDrawerLayout from './ConfigDrawerLayout';
import { GlobalProvider } from './components/GlobalStore';
import { GlobalToaster } from './components/GlobalToaster';
import Header from './components/Header';
import NavBar from './components/NavBar';
import { ReactQueryProvider } from './components/ReactQueryProvider';

const TranslateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <GlobalProvider>
        <GlobalToaster />
        <ConfigDrawerLayout>
          <Header />
          {children}
          <NavBar />
        </ConfigDrawerLayout>
      </GlobalProvider>
    </ReactQueryProvider>
  );
};

export default TranslateLayout;
