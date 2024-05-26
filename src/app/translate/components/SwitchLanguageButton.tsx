'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-daisyui';
import { useTranslation } from 'react-i18next';
import { FaLanguage, FaSortDown } from 'react-icons/fa';
import { useLocalStorage, useOnClickOutside } from 'usehooks-ts';

// import EnFlag from '../svg/flags/en.svg?react';
// import HkFlag from '../svg/flags/hk.svg?react';
// import JpFlag from '../svg/flags/jp.svg?react';

const LANGUAGES = [
  {
    code: 'en-US',
    icon: '/flags/en.svg',
    name: 'English',
  },
  {
    code: 'zh-CW',
    icon: '/flags/hk.svg',
    name: '简体中文',
  },
  {
    code: 'ja-JP',
    icon: '/flags/jp.svg',
    name: '日本語',
  },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

export function SwitchLanguageButton() {
  const { t, i18n } = useTranslation('translate');
  const ref = useRef(null);
  const [lang, setLang] = useLocalStorage<LanguageCode>('langCode', 'en-US');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useOnClickOutside(ref, () => setIsMenuOpen(false));

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    i18n.changeLanguage(lang);
  }, [i18n, lang]);

  useEffect(() => {
    if (!isMenuOpen && document.activeElement) {
      const elem = document.activeElement as HTMLElement;
      elem.blur();
    }
  }, [isMenuOpen]);

  return (
    <div
      className={clsx('dropdown', 'dropdown-end', isMenuOpen && 'dropdown-open')}
      ref={ref}
      title="Change Language"
    >
      <Button
        className="gap-1 normal-case"
        color="ghost"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        tabIndex={0}
        title={t('Change Language')}
        type="button"
      >
        <FaLanguage size={20} />
        <FaSortDown size={12} />
      </Button>
      <div className="w-56 mt-16 overflow-y-auto shadow-2xl dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px">
        <ul className="gap-1 p-3 menu menu-compact" tabIndex={0}>
          {LANGUAGES.map((language) => (
            <li key={language.code}>
              <a
                className={clsx('flex items-center', i18n.language === language.code && 'active')}
                onClick={() => {
                  setLang(language.code);
                  setIsMenuOpen(false);
                }}
              >
                <Image alt="en" height={20} src={language.icon} width={20} />
                <span className="flex justify-between flex-1">{language.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
