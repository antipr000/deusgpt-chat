import { useTranslation } from 'react-i18next';
import { FaMoon, FaSun } from 'react-icons/fa';

import { useDarkMode } from '../hooks/theme';

export function ToggleThemeButton() {
  const { t } = useTranslation('translate');
  const [darkMode, setDarkMode] = useDarkMode();
  return (
    <label
      className="swap swap-rotate btn btn-ghost btn-circle"
      title={t('topBar.darkModeSwitcherTitle')}
    >
      <input
        checked={!darkMode}
        onClick={() => setDarkMode(!darkMode)}
        readOnly
        title="Dark Mode Switcher"
        type="checkbox"
      />
      <FaSun className="w-5 h-5 fill-current swap-on" size={20} />
      <FaMoon className="w-5 h-5 fill-current swap-off" size={20} />
    </label>
  );
}
