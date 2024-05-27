import { useCallback } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaEllipsisV, FaTrashAlt } from 'react-icons/fa';

import { useGlobalStore } from '../components/GlobalStore';
import { TTSButton } from '../components/TTSButton';
import { LANGUAGES, Language } from '../constants';
import { formatTime } from '../utils';

function HistoryRecord() {
  const { t, i18n } = useTranslation('translate');
  const {
    history: { historyRecords, setHistoryRecords },
  } = useGlobalStore();

  const handleDeleteHistoryRecord = useCallback(
    (id: string) => {
      (document.activeElement as HTMLElement).blur();
      setHistoryRecords((prev) => prev.filter((record) => record.id !== id));
      toast.success(t('Delete history record successfully.'));
    },
    [setHistoryRecords],
  );

  const handleClearHistoryRecords = useCallback(() => {
    (document.activeElement as HTMLElement).blur();
    setHistoryRecords([]);
    toast.success(t('Clear history records successfully.'));
  }, [setHistoryRecords]);

  const handleCopyOriginalText = useCallback(
    (id: string) => {
      (document.activeElement as HTMLElement).blur();
      const record = historyRecords.find((record) => record.id === id);
      if (!record) {
        return;
      }
      navigator.clipboard.writeText(record.text);
      toast.success(t('Copy original text successfully.'));
    },
    [historyRecords],
  );

  const handleCopyTranslation = useCallback(
    (id: string) => {
      (document.activeElement as HTMLElement).blur();
      const record = historyRecords.find((record) => record.id === id);
      if (!record) {
        return;
      }
      navigator.clipboard.writeText(record.translation);
      toast.success(t('Copy translation successfully.'));
    },
    [historyRecords],
  );

  return (
    <div className="container max-w-screen-md p-4 m-0 mb-12 md:mx-auto">
      <h1 className="flex justify-between w-full text-2xl font-bold align-middle bg-base-100">
        <span className="leading-[48px]">{t('History Record')}</span>
        {!!historyRecords && !!historyRecords.length && (
          <div className="dropdown dropdown-end">
            <label className="ml-6 btn-outline btn btn-error btn-xs" tabIndex={0}>
              <FaTrashAlt className="mr-2" size={12} />
              {t('Clear All')}
            </label>
            <div
              className="w-64 p-2 shadow dropdown-content card card-compact bg-warning text-warning-content z-50"
              tabIndex={0}
            >
              <div className="card-body">
                <h3 className="card-title">{t('Notice!')}</h3>
                <p>{t('Do you really want to clear all history?')}</p>
                <div className="flex justify-end">
                  <Button
                    color="ghost"
                    onClick={() => (document.activeElement as HTMLElement).blur()}
                    size="sm"
                  >
                    {t('Cancel')}
                  </Button>
                  <Button
                    className="ml-2"
                    color="error"
                    onClick={handleClearHistoryRecords}
                    size="sm"
                  >
                    {t('Yes')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </h1>
      <ul className="text-base-content">
        {!!historyRecords &&
          !!historyRecords.length &&
          historyRecords.map((record) => (
            <li className="my-2" key={record.id}>
              <div className="chat chat-end">
                <div className="chat-header">
                  <span>
                    <span className="font-bold">
                      {LANGUAGES[record.fromLanguage as Language] || record.fromLanguage || 'Auto'}
                    </span>
                    <span className="mx-2">→</span>
                    <span className="font-bold">
                      {LANGUAGES[record.toLanguage as Language] || record.fromLanguage || 'Auto'}
                    </span>
                    <div className="dropdown dropdown-end z-[1]">
                      <label className="mx-1 btn btn-sm btn-ghost btn-circle" tabIndex={0}>
                        <FaEllipsisV size={8} />
                      </label>
                      <ul
                        className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52"
                        tabIndex={0}
                      >
                        <li>
                          <a
                            className="font-bold text-error"
                            onClick={() => handleDeleteHistoryRecord(record.id)}
                          >
                            {t('Delete this record')}
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleCopyOriginalText(record.id)}>
                            {t('Copy original text')}
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleCopyTranslation(record.id)}>
                            {t('Copy translation')}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </span>
                  <time className="text-xs leading-8 opacity-50">
                    {formatTime(record.createdAt, i18n.language || 'en-US')}
                  </time>
                </div>
                <div className="chat-bubble whitespace-pre-line break-words">
                  {record.text}
                  <TTSButton
                    className="ml-1"
                    language={record.fromLanguage === 'auto' ? 'en-US' : record.fromLanguage}
                    size="xs"
                    text={record.text}
                  />
                </div>
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-info whitespace-pre-line break-words">
                  {record.translation}
                  <TTSButton
                    className="ml-1"
                    language={record.toLanguage === 'auto' ? 'en-US' : record.toLanguage}
                    size="xs"
                    text={record.translation}
                  />
                </div>
              </div>
            </li>
          ))}
        {!historyRecords?.length && <p className="">{t('No history record.')}</p>}
      </ul>
    </div>
  );
}
export default HistoryRecord;
