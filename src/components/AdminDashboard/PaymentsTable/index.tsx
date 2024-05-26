'use client';

import { Table } from 'antd';
import type { TableProps } from 'antd';
import React, { useEffect, useState } from 'react';

import { getAllPayments } from '@/helpers/api';
import { postMessageToParent } from '@/helpers/iframe.notification';
import { PaymentWithUser } from '@/types/common/Payment.type';

type ColumnsType<T extends object> = TableProps<T>['columns'];

const columns: ColumnsType<PaymentWithUser> = [
  {
    dataIndex: 'sessionId',
    key: 'sessionId',
    title: 'Payment Id',
  },
  {
    dataIndex: 'email',
    key: 'email',
    title: 'Email',
  },
  {
    dataIndex: 'firstName',
    key: 'firstName',
    title: 'First Name',
  },
  {
    dataIndex: 'lastName',
    key: 'lastName',
    title: 'Last Name',
  },
  {
    dataIndex: 'status',
    key: 'status',
    title: 'Payment Status',
  },
  {
    dataIndex: 'plan',
    key: 'plan',
    title: 'Plan',
  },
  {
    dataIndex: 'amount',
    key: 'amount',
    title: 'Amount',
  },
  {
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date: string) => new Date(date).toISOString().split('T')[0],
    title: 'Started On',
  },
  {
    dataIndex: 'completedAt',
    key: 'completedAt',
    render: (date: string) => new Date(date).toISOString().split('T')[0],
    title: 'Completed On',
  },
  {
    dataIndex: 'invoiceId',
    key: 'invoiceId',
    render: (link: string) => (
      <a
        href={'#'}
        onClick={() => {
          console.log('Link', link);
          postMessageToParent('open-link', link);
        }}
      >
        {' '}
        Link{' '}
      </a>
    ),
    title: 'Invoice',
  },
];

const PaymentsTable = () => {
  const [payments, setPayments] = useState<PaymentWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTimer, setRefreshTimer] = useState(10);

  useEffect(() => {
    getAllPayments()
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });

    const timer2 = setInterval(() => {
      setRefreshTimer((prevState) => Math.max(prevState - 1, 0));
    }, 1000);
    const timer = setInterval(() => {
      setLoading(true);
      getAllPayments()
        .then((data) => {
          setPayments(data);
          setLoading(false);
          setRefreshTimer(10);
        })
        .catch((err) => {
          setLoading(false);
        });
    }, 10000);

    return () => {
      clearInterval(timer2);
      clearInterval(timer);
    };
  }, []);

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={payments}
      pagination={{
        pageSize: 10,
      }}
      footer={() => <span> Auto refreshes in {refreshTimer} seconds </span>}
    />
  );
};

export default PaymentsTable;
