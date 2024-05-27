import { ActionIcon } from '@lobehub/ui';
import { useAtom, useAtomValue } from 'jotai';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BsGearWideConnected } from 'react-icons/bs';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { translateSidebarAtom } from '@/store/atoms/translate.sidebar.atom';

export function ConfigButton() {
  const [showSidebar, setShowSidebar] = useAtom(translateSidebarAtom);
  const { t } = useTranslation('translate');
  return (
    // <label
    //   className="drawer-button btn btn-primary btn-ghost btn-circle"
    //   htmlFor="history-record-drawer"
    //   title={t('Config')}
    // >

    //   {/* <BsGearWideConnected size={20} /> */}
    // </label>
    <ActionIcon
      icon={showSidebar ? PanelLeftClose : PanelLeftOpen}
      size={DESKTOP_HEADER_ICON_SIZE}
      onClick={() => setShowSidebar((prev) => !prev)}
    />
  );
}
