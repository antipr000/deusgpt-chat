// import nextPWA from '@ducanh2912/next-pwa';
import analyzer from '@next/bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';
const buildWithDocker = process.env.DOCKER === 'true';

// if you need to proxy the api endpoint to remote server
const API_PROXY_ENDPOINT = process.env.API_PROXY_ENDPOINT || '';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: isProd,
  basePath,
  experimental: {
    optimizePackageImports: [
      'emoji-mart',
      '@emoji-mart/react',
      '@emoji-mart/data',
      '@icons-pack/react-simple-icons',
      '@lobehub/ui',
      'gpt-tokenizer',
      'chroma-js',
      'shiki',
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  output: buildWithDocker ? 'standalone' : undefined,

  redirects: async () => [
    {
      source: '/settings',
      permanent: true,
      destination: '/settings/common',
    },
  ],
  rewrites: async () => [
    // due to google api not work correct in some countries
    // we need a proxy to bypass the restriction
    { source: '/api/chat/google', destination: `${API_PROXY_ENDPOINT}/api/chat/google` },
  ],
  reactStrictMode: true,

  webpack(config) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // to fix shikiji compile error
    // refs: https://github.com/antfu/shikiji/issues/23
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};

const noWrapper = (config) => config;

const withBundleAnalyzer = process.env.ANALYZE === 'true' ? analyzer() : noWrapper;

// const withPWA = isProd
//   ? nextPWA({
//       dest: 'public',
//       register: true,
//       workboxOptions: {
//         skipWaiting: true,
//       },
//     })
//   : noWrapper;

export default withBundleAnalyzer(nextConfig);
