import React, { Suspense } from 'react';

import ConfigPage from './pages/Config';

type Props = {
  children: React.ReactNode;
};

function ConfigDrawerLayout(props: Props) {
  const { children } = props;

  return (
    <>
      <input id="history-record-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side z-50 overflow-hidden">
        <label htmlFor="history-record-drawer" className="drawer-overlay"></label>
        <ConfigPage />
      </div>
    </>
  );
}

export default ConfigDrawerLayout;
