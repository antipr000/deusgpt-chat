import { useEffect, useState } from 'react';

import { getUsageForDateRange } from '@/helpers/api';

const getPromiseArray: (models: string[]) => Array<Promise<number>> = (models: string[]) => {
  const startOfToady = new Date();
  startOfToady.setHours(0, 0, 0, 0);
  const dateBeforeSevenDays = new Date();
  dateBeforeSevenDays.setDate(dateBeforeSevenDays.getDate() - 7);
  const dateBeforeThirtyDays = new Date();
  dateBeforeThirtyDays.setDate(dateBeforeThirtyDays.getDate() - 30);

  const modelsQuery = encodeURIComponent(models.join(','));
  return [
    getUsageForDateRange(modelsQuery, startOfToady),
    getUsageForDateRange(modelsQuery, dateBeforeSevenDays),
    getUsageForDateRange(modelsQuery, dateBeforeThirtyDays),
  ];
};

const useTokenUsage = (models: string[]) => {
  const [tokenUsage, setTokenUsage] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (models.length) {
      setLoading(true);

      Promise.all(getPromiseArray(models)).then((data) => {
        setTokenUsage(data);
        setLoading(false);
      });
    }
  }, [models]);

  return [loading, tokenUsage as [number, number, number]];
};

export default useTokenUsage;
