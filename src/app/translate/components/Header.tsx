import { Navbar } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { BsGithub, BsTwitter } from 'react-icons/bs';

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

function Header() {
  const { t } = useTranslation('translate');
  return (
    <>
      <AboutModal />
      <Navbar className="sticky top-0 z-50 bg-primary text-primary-content">
        <div className="flex-1">
          <label className="text-xl normal-case btn btn-ghost" htmlFor="about-modal">
            {t('topBar.title')}
          </label>
        </div>
        <div className="flex-none">
          <ConfigButton />
          <ToggleThemeButton />
          <SwitchLanguageButton />
        </div>
      </Navbar>
    </>
  );
}

export default Header;
