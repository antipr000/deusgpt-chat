'use client';

import React, { ReactNode } from 'react';
import { Flexbox } from 'react-layout-kit';

import '@/styles/global.css';

// import ConfigDrawerLayout from './ConfigDrawerLayout';
import ConfigPanel from './components/ConfigPanel';
import { GlobalProvider } from './components/GlobalStore';
import { GlobalToaster } from './components/GlobalToaster';
import Header from './components/Header';
import NavBar from './components/NavBar';
import { ReactQueryProvider } from './components/ReactQueryProvider';
import ConfigPage from './pages/Config';

const TranslateLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <GlobalProvider>
        <GlobalToaster />
        {/* <ConfigDrawerLayout>
          <Header />
          {children}
          <NavBar />
        </ConfigDrawerLayout> */}
        <Flexbox direction="horizontal" style={{ width: '100% ' }}>
          <ConfigPanel>
            <ConfigPage />
          </ConfigPanel>
          <Flexbox style={{ flex: '1 0 auto' }}>
            <Header />
            {children}
            <NavBar />
          </Flexbox>
        </Flexbox>
      </GlobalProvider>
    </ReactQueryProvider>
  );
};

export default TranslateLayout;
