'use client';

import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { userAtom } from '@/store/atoms/user.atom';

const FullName = () => {
  const user = useAtomValue(userAtom);

  const nameToDisplay = useMemo(() => {
    return user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email;
  }, [user?.firstName, user?.lastName, user?.email]);

  return (
    <span>
      {nameToDisplay?.length!! > 20 ? `${nameToDisplay?.slice(0, 20)} ...` : nameToDisplay}
    </span>
  );
};

export default FullName;
