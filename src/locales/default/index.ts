import tool from '../default/tool';
import admin from './admin';
import auth from './auth';
import chat from './chat';
import clerk from './clerk';
import common from './common';
import components from './components';
import error from './error';
import market from './market';
import metadata from './metadata';
import migration from './migration';
import modelProvider from './modelProvider';
import plugin from './plugin';
import setting from './setting';
import welcome from './welcome';
import translate from './translate';

const resources = {
  admin,
  auth,
  chat,
  clerk,
  common,
  components,
  error,
  market,
  metadata,
  migration,
  modelProvider,
  plugin,
  setting,
  tool,
  translate,
  welcome,
} as const;

export default resources;
