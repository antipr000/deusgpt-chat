import { BsTranslate } from 'react-icons/bs';
import { FaHistory } from 'react-icons/fa';

const NAV_ITEMS = [
  { icon: <BsTranslate size={24} />, key: 'translator', label: 'Translator', to: '/translate' },
  { icon: <FaHistory size={24} />, key: 'history', label: 'History records', to: '/translate/history' },
] as const;

export default NAV_ITEMS;
