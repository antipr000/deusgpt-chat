import React from 'react';
import { Flexbox } from 'react-layout-kit';

import PaymentsTable from '@/components/AdminDashboard/PaymentsTable';

const PaymentsPage = () => {
  return (
    <Flexbox style={{ padding: '20px', width: '100%' }}>
      <PaymentsTable />
    </Flexbox>
  );
};

export default PaymentsPage;
