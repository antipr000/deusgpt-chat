'use client';

import React from 'react';
import { Flexbox } from 'react-layout-kit';

import TonkenUsage from '@/components/AdminDashboard/TokenUsage';
import UsersJoined from '@/components/AdminDashboard/UsersJoined';

const DashboardPage = () => {
  return (
    <Flexbox gap={40} style={{ padding: '15px', width: '100%' }}>
      <TonkenUsage />
      <UsersJoined />
    </Flexbox>
  );
};

export default DashboardPage;
