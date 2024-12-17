//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/

const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Authorization, Date, X-Api-Version' },
        ],
      },
    ];
  },
  env: {
    MONGO_URI: process.env.MONGO_URI ?? '',
    SEND_GRID_EMAIL_KEY: process.env.SEND_GRID_EMAIL_KEY ?? '',
    SEND_GRID_API_ID: process.env.SEND_GRID_API_ID ?? '',
    JWT_SECRET: process.env.JWT_SECRET ?? '',
    VERCEL_TOKEN: process.env.VERCEL_TOKEN ?? ''
  },
  nx: {
    svgr: false,
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
