'use client';

import { App, Input, Select, Table } from 'antd';
import type { TableProps } from 'antd';
import { debounce } from 'lodash';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { adminUpdatePayment, getAllPayments } from '@/helpers/api';
import { postMessageToParent } from '@/helpers/iframe.notification';
import { PaymentWithUser } from '@/types/common/Payment.type';

type ColumnsType<T extends object> = TableProps<T>['columns'];

const paymentStatusOptions = [
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
  { value: 'cancelled', label: 'Cancelled' },
];

const planOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
];

const PaymentsTable = () => {
  const [payments, setPayments] = useState<PaymentWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTimer, setRefreshTimer] = useState(20);

  const { message } = App.useApp();

  const columns: ColumnsType<PaymentWithUser> = useMemo(() => {
    return [
      {
        dataIndex: 'sessionId',
        key: 'sessionId',
        title: 'Payment Id',
        render: (text: string) => {
          return <span> {text.substring(0, 20)}... </span>;
        },
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
        render: (text: string, record: PaymentWithUser) => {
          const changeStatus = async (value: string) => {
            await adminUpdatePayment({
              sessionId: record.sessionId,
              status: value,
            });
          };
          return (
            <Select
              options={paymentStatusOptions}
              defaultValue={text}
              onChange={debounce(changeStatus, 2000)}
            />
          );
        },
      },
      {
        dataIndex: 'plan',
        key: 'plan',
        title: 'Plan',
        render: (text: string, record: PaymentWithUser) => {
          const changePlan = async (value: string) => {
            await adminUpdatePayment({
              sessionId: record.sessionId,
              plan: value,
            });
          };
          return (
            <Select
              options={planOptions}
              defaultValue={text}
              onChange={debounce(changePlan, 2000)}
            />
          );
        },
      },
      {
        dataIndex: 'amount',
        key: 'amount',
        title: 'Amount',
        render: (text: string, record: PaymentWithUser) => {
          const changeName = async (event: ChangeEvent<HTMLInputElement>) => {
            if (!isNaN(parseFloat(event.target.value))) {
              await adminUpdatePayment({
                sessionId: record.sessionId,
                amount: parseFloat(event.target.value),
              });
            } else {
              message.error('Please enter a valid decimal value', 1000);
            }
          };
          return <Input name="amount" defaultValue={text} onChange={debounce(changeName, 2000)} />;
        },
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
  }, []);

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
          setRefreshTimer(20);
        })
        .catch((err) => {
          setLoading(false);
        });
    }, 20000);

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
