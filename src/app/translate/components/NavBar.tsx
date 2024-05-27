'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import NAV_ITEMS from '../constants/NavItems';

function NavBar() {
  const pathname = usePathname();
  const { t } = useTranslation('translate');

  const selectedKey = NAV_ITEMS.find(({ to }) => pathname === to)?.key;

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-50 items-center block h-[calc(48px+env(safe-area-inset-bottom))] rounded-tabs glass"
      id="bottom-navigation"
    >
      <ul className="flex justify-around max-w-screen-md p-0 m-0 mx-auto" id="tabs">
        {NAV_ITEMS.map(({ key, label, to, icon }) => (
          <li
            className={clsx(
              'flex-col w-24 duration-300',
              selectedKey === key ? 'text-primary' : 'text-base-content',
            )}
            key={key}
          >
            <Link
              className={`flex flex-col ${selectedKey === key ? 'text-[#ec5e41]' : 'text-[#080808]'} items-center`}
              draggable="false"
              href={to}
              title={t(`navbar.${label}`)}
            >
              <div
                className={clsx(
                  'w-10 h-1 mb-2 duration-300 rounded-full',
                  selectedKey === key ? 'bg-[#ec5e41]' : 'bg-transparent',
                )}
              ></div>
              {icon}
              {/* <span className='block text-xs font-semibold'>{t(`navbar.${label}`)}</span> */}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NavBar;
