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
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date: string) => new Date(date).toISOString().split('T')[0],
    title: 'Registered On',
  },
];

const MembersTable = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  return <Table columns={columns} dataSource={users} />;
};

export default MembersTable;
