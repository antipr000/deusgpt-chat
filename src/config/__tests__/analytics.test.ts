// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { analyticsEnv, getAnalyticsConfig } from '../analytics';

beforeEach(() => {
  // 在每个测试用例之前,清除所有的 console.warn mock
  console.warn = vi.fn();
});

afterEach(() => {
  // 在每个测试用例之后,恢复所有的环境变量
  vi.resetModules();
});

describe('getAnalyticsConfig', () => {
  it('should return the correct analytics config', () => {
    // 设置环境变量
    process.env.PLAUSIBLE_DOMAIN = 'example.com';
    process.env.POSTHOG_KEY = 'posthog_key';
    process.env.UMAMI_WEBSITE_ID = 'umami_id';
    process.env.CLARITY_PROJECT_ID = 'clarity_id';
    process.env.ENABLE_VERCEL_ANALYTICS = '1';
    process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID = 'ga_id';

    const config = getAnalyticsConfig();

    expect(config).toEqual({
      ENABLED_PLAUSIBLE_ANALYTICS: true,
      PLAUSIBLE_DOMAIN: 'example.com',
      PLAUSIBLE_SCRIPT_BASE_URL: 'https://plausible.io',
      ENABLED_POSTHOG_ANALYTICS: true,
      POSTHOG_KEY: 'posthog_key',
      POSTHOG_HOST: 'https://app.posthog.com',
      DEBUG_POSTHOG_ANALYTICS: false,
      ENABLED_UMAMI_ANALYTICS: true,
      UMAMI_SCRIPT_URL: 'https://analytics.umami.is/script.js',
      UMAMI_WEBSITE_ID: 'umami_id',
      ENABLED_CLARITY_ANALYTICS: true,
      CLARITY_PROJECT_ID: 'clarity_id',
      ENABLE_VERCEL_ANALYTICS: true,
      DEBUG_VERCEL_ANALYTICS: false,
      ENABLE_GOOGLE_ANALYTICS: true,
      GOOGLE_ANALYTICS_MEASUREMENT_ID: 'ga_id',
    });
  });

  it('should use deprecated env vars and log warnings', () => {
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = 'deprecated.com';
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'deprecated_key';
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'deprecated_id';

    const config = getAnalyticsConfig();

    expect(config.ENABLED_PLAUSIBLE_ANALYTICS).toBeTruthy();
    expect(config.ENABLED_POSTHOG_ANALYTICS).toBeTruthy();
    expect(config.ENABLED_UMAMI_ANALYTICS).toBeTruthy();

    expect(console.warn).toHaveBeenCalledTimes(3);
    expect(console.warn).toHaveBeenCalledWith(
      'NEXT_PUBLIC_PLAUSIBLE_DOMAIN is deprecated. Please use PLAUSIBLE_DOMAIN instead. We will remove it in DeusGPT Chat 1.0',
    );
    expect(console.warn).toHaveBeenCalledWith(
      'NEXT_PUBLIC_POSTHOG_KEY is deprecated. Please use POSTHOG_KEY instead. We will remove it in DeusGPT Chat 1.0',
    );
    expect(console.warn).toHaveBeenCalledWith(
      'NEXT_PUBLIC_UMAMI_WEBSITE_ID is deprecated. Please use UMAMI_WEBSITE_ID instead. We will remove it in DeusGPT Chat 1.0',
    );
  });
});
