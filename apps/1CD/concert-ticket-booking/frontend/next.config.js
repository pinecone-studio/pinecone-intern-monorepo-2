//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
  env: {
    BACKEND_URI: process.env.BACKEND_URI,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    NEXT_PUBLIC_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUD_NAME,
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
