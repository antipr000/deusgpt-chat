import { DraggablePanel, DraggablePanelContainer, DraggablePanelProps } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { useAtom } from 'jotai';
import React, { FC, ReactNode, useState } from 'react';

import { translateSidebarAtom } from '@/store/atoms/translate.sidebar.atom';

export const useStyles = createStyles(({ css, token }) => ({
  panel: css`
    height: 100%;
    color: ${token.colorTextSecondary};
    background: ${token.colorBgContainer};
  `,
}));

const ConfigPanel: FC<{ children: ReactNode }> = ({ children }) => {
  const { styles } = useStyles();
  const [width, setWidth] = useState('350px');
  const [showSidebar, setShowSidebar] = useAtom(translateSidebarAtom);

  const handleSizeChange: DraggablePanelProps['onSizeChange'] = (_, size) => {
    setWidth(size?.width as string);
  };

  const handleExpand = (expand: boolean) => {
    setShowSidebar(expand);
  };

  return (
    <DraggablePanel
      className={styles.panel}
      defaultSize={{ width: 300 }}
      expand={showSidebar}
      maxWidth={500}
      minWidth={250}
      onExpandChange={handleExpand}
      onSizeChange={handleSizeChange}
      placement="left"
      size={{ height: '100%', width }}
    >
      <DraggablePanelContainer style={{ flex: 'none', height: '100%', minWidth: '200px' }}>
        {children}
      </DraggablePanelContainer>
    </DraggablePanel>
  );
};

export default ConfigPanel;
