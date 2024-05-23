'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Flexbox } from 'react-layout-kit';
// import UserAvatar from './UserAvatar';

const Nav = memo(() => {
  return (
    <Flexbox align="center" style={{ borderRight: '1px solid #dddddd', height: '100%'}} width={64}>
      <Link href="/" style={{ marginTop: 12 }}>
        <Image alt="logo" height={45} src="/logo.png" width={45}  />
      </Link>
      <div
        style={{ marginTop: 'auto '}}
      >
        {/* <UserAvatar onlyIcon placement="top-start" user={{}} /> */}
      </div>
    </Flexbox>
  );
});

Nav.displayName = 'DesktopNav';

export default Nav;
