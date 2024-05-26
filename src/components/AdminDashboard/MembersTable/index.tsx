'use client';

import { Table } from 'antd';
import type { TableProps } from 'antd';
import React, { useEffect, useState } from 'react';

import { getAllUsers } from '@/helpers/api';
import { User } from '@/types/common/User.type';

type ColumnsType<T extends object> = TableProps<T>['columns'];

const columns: ColumnsType<User> = [
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
    dataIndex: 'email',
    key: 'email',
    title: 'Email',
  },
  {
    dataIndex: 'plan',
    key: 'plan',
    title: 'Plan',
  },
  {
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date: string) => new Date(date).toISOString().split('T')[0],
    title: 'Registered On',
  },
];

const MembersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTimer, setRefreshTimer] = useState(10);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setUsers(data);
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
      getAllUsers()
        .then((data) => {
          setUsers(data);
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
      dataSource={users}
      pagination={{
        pageSize: 10,
      }}
      footer={() => <span> Auto refreshes in {refreshTimer} seconds </span>}
    />
  );
};

export default MembersTable;
