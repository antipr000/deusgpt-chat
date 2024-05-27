'use client';

import { ActionIcon, ChatHeader } from '@lobehub/ui';
import { Flex, Image } from 'antd';
import { createStyles } from 'antd-style';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { BsGithub, BsTwitter } from 'react-icons/bs';
import { Flexbox } from 'react-layout-kit';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';

import { ConfigButton } from './ConfigButton';
import { SwitchLanguageButton } from './SwitchLanguageButton';
import { ToggleThemeButton } from './ToggleThemeButton';

function AboutModal() {
  return (
    <>
      <input className="modal-toggle" id="about-modal" type="checkbox" />
      <label className="cursor-pointer modal" htmlFor="about-modal">
        <label className="relative modal-box" htmlFor="">
          <h3 className="text-lg font-bold">About OpenAI Translator</h3>
          <p className="py-4">Author: Lance.Moe</p>
          <p className="grid grid-cols-2 gap-2 py-4">
            <a
              className="btn btn-outline"
              href="https://github.com/LanceMoe/openai-translator"
              rel="noreferrer noopener"
              target="_blank"
            >
              <BsGithub className="mr-2" size={20} />
              GitHub
            </a>

            <a
              className="btn btn-outline btn-primary"
              href="https://twitter.com/lance_moe"
              rel="noreferrer noopener"
              target="_blank"
            >
              <BsTwitter className="mr-2" size={20} />
              Twitter
            </a>
          </p>
        </label>
      </label>
    </>
  );
}

const useStyles = createStyles(({ css }) => ({
  left: css`
    flex: 0 auto;
  `,
}));

const HeaderAction = () => {
  return (
    <div className="flex flex-row align-center">
      <ConfigButton />
      {/* <ToggleThemeButton /> */}
      {/* <SwitchLanguageButton /> */}
    </div>
  );
};

const Main = () => {
  return (
    <Flex align={'center'} gap={8} dir="row">
      <ConfigButton />
      <img src="logo.png" width={50} height={50} />
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'rgb(102, 102, 102)' }}>
        DeusGPT
      </div>
    </Flex>
  );
};

const Header = () => {
  const { styles } = useStyles();
  const showSessionPanel: boolean | undefined = useGlobalStore(
    (s) => s.preference.showSessionPanel,
  );
  const { t } = useTranslation('chat');

  return (
    <ChatHeader
      classNames={{ left: styles.left }}
      left={<Main />}
      style={{
        position: 'unset',
        height: '80px',
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
