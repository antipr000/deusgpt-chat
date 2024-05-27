'use client';

import { DeleteOutlined } from '@ant-design/icons';
import { App, Button, Input, Select, Table } from 'antd';
import type { TableProps } from 'antd';
import { debounce } from 'lodash';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { adminDeleteUser, adminUpdateUser, getAllUsers, updateUser } from '@/helpers/api';
import { User } from '@/types/common/User.type';

type ColumnsType<T extends object> = TableProps<T>['columns'];

const planOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
];

const MembersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTimer, setRefreshTimer] = useState(20);

  const { modal } = App.useApp();

  const columns: ColumnsType<User> = useMemo(() => {
    return [
      {
        dataIndex: 'firstName',
        key: 'firstName',
        title: 'First Name',
        render: (text: string, record: User) => {
          const changeName = async (event: ChangeEvent<HTMLInputElement>) => {
            await adminUpdateUser({
              firebaseId: record.firebaseId,
              firstName: event.target.value,
            });
          };
          return (
            <Input name="firstName" defaultValue={text} onChange={debounce(changeName, 2000)} />
          );
        },
      },
      {
        dataIndex: 'lastName',
        key: 'lastName',
        title: 'Last Name',
        render: (text: string, record: User) => {
          const changeName = async (event: ChangeEvent<HTMLInputElement>) => {
            await adminUpdateUser({
              firebaseId: record.firebaseId,
              lastName: event.target.value,
            });
          };
          return (
            <Input name="lastName" defaultValue={text} onChange={debounce(changeName, 2000)} />
          );
        },
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
        render: (text: string, record: User) => {
          const changePlan = async (value: string) => {
            await adminUpdateUser({
              firebaseId: record.firebaseId,
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
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => new Date(date).toISOString().split('T')[0],
        title: 'Registered On',
      },
      {
        key: 'delete',
        render: (_, record: User) => {
          const handleDelete = async () => {
            modal.confirm({
              centered: true,
              okButtonProps: { danger: true },
              onOk: async () => {
                await adminDeleteUser(record.firebaseId);

                setUsers((prevState) => {
                  const filteredUsers = prevState.filter(
                    (user) => user.firebaseId !== record.firebaseId,
                  );
                  return filteredUsers;
                });
              },
              title: 'Sure you want to delete?',
            });
          };
          return (
            <Button
              shape="round"
              size={'small'}
              icon={<DeleteOutlined />}
              danger
              onClick={handleDelete}
            />
          );
        },
      },
    ];
  }, []);

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
      dataSource={users}
      pagination={{
        pageSize: 10,
      }}
      footer={() => <span> Auto refreshes in {refreshTimer} seconds </span>}
    />
  );
};

export default MembersTable;
