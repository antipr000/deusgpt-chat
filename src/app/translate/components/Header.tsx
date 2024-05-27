'use client';

import { ChatHeader } from '@lobehub/ui';
import { Flex } from 'antd';
import { createStyles } from 'antd-style';
// import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
// import Link from 'next/link';
import Image from 'next/image';

// import { Navbar } from 'react-daisyui';
// import { useTranslation } from 'react-i18next';
// import { BsGithub, BsTwitter } from 'react-icons/bs';
// import { Flexbox } from 'react-layout-kit';
// import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
// import { useGlobalStore } from '@/store/global';
import { ConfigButton } from './ConfigButton';

// import { SwitchLanguageButton } from './SwitchLanguageButton';
// import { ToggleThemeButton } from './ToggleThemeButton';

const useStyles = createStyles(({ css }) => ({
  left: css`
    flex: 0 auto;
  `,
}));

const Main = () => {
  return (
    <Flex align={'center'} dir="row" gap={8}>
      <ConfigButton />
      <img src="/logo.png" width={50} height={50} />
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'rgb(102, 102, 102)' }}>
        DeusGPT
      </div>
    </Flex>
  );
};

const Header = () => {
  const { styles } = useStyles();

  return (
    <ChatHeader
      classNames={{ left: styles.left }}
      left={<Main />}
      style={{
        height: '80px',
        position: 'unset',
      }}
    />
  );
};

export default Header;

// function Header() {
//   const { t } = useTranslation('translate');
//   return (
//     <>
//       <Flexbox
//         flex={'row'}
//         align="center"
//         justify="flex-end"
//         style={{ borderRight: '1px solid #dddddd', width: '100%' }}
//         className="sticky top-0 z-50"
//         height={64}
//       >

//         <div className="flex-none">
//           <ConfigButton />
//           <ToggleThemeButton />
//           <SwitchLanguageButton />
//         </div>
//       </Flexbox>
//       {/* <Navbar className="sticky top-0 z-50 bg-primary text-primary-content">
//         <div className="flex-1">
//           <label className="text-xl normal-case btn btn-ghost" htmlFor="about-modal">
//             {t('topBar.title')}
//           </label>
//         </div>

//       </Navbar> */}
//     </>
//   );
// }

// export default Header;
