import axios from 'axios';
import { NextResponse } from 'next/server';

import { DEFAULT_LANG } from '@/const/locale';

import { PluginStore } from './Store';

export const GET = async (req: Request) => {
  const locale = new URL(req.url).searchParams.get('locale');

  const pluginStore = new PluginStore();

  let res: any;

  res = await axios.get(pluginStore.getPluginIndexUrl(locale as any));

  if (res.status === 404) {
    res = await axios.get(pluginStore.getPluginIndexUrl(DEFAULT_LANG));
  }

  return NextResponse.json(res.data);
};
