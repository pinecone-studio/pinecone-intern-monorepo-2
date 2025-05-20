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
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
