import { useAtom, useAtomValue } from 'jotai';
import React from 'react';

import { translateSidebarAtom } from '@/store/atoms/translate.sidebar.atom';

import ConfigPage from './pages/Config';

type Props = {
  children: React.ReactNode;
};

function ConfigDrawerLayout(props: Props) {
  const { children } = props;
  const [showSidebar, setShowSidebar] = useAtom(translateSidebarAtom);

  return (
    <>
      <input
        className="drawer-toggle"
        id="history-record-drawer"
        type="checkbox"
        readOnly
        checked={showSidebar}
      />
      <div className="drawer-content w-full bg-base-100">{children}</div>
      <div className="drawer-side z-50 overflow-hidden">
        <label className="drawer-overlay" htmlFor="history-record-drawer"></label>
        <ConfigPage />
      </div>
    </>
  );
}

export default ConfigDrawerLayout;
