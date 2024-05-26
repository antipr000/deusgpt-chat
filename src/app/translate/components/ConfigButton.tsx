import { useTranslation } from 'react-i18next';
import { BsGearWideConnected } from 'react-icons/bs';

export function ConfigButton() {
  const { t } = useTranslation('translate');
  return (
    <label
      className="drawer-button btn btn-primary btn-ghost btn-circle"
      htmlFor="history-record-drawer"
      title={t('Config')}
    >
      <BsGearWideConnected size={20} />
    </label>
  );
}
