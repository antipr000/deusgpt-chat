import React from 'react';
import { Flexbox } from 'react-layout-kit';

import MembersTable from '@/components/AdminDashboard/MembersTable';

const MembersPage = () => {
  return (
    <Flexbox style={{ padding: '20px', width: '100%' }}>
      <MembersTable />
    </Flexbox>
  );
};

export default MembersPage;
