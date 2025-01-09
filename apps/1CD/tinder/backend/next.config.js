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
    MONGO_URI: process.env.MONGO_URI,
    VERCEL_TOKEN:process.env.VERCEL_TOKEN,
    CLOUD_NAME:process.env.CLOUD_NAME,
    API_KEY:process.env.API_KEY,
    API_SECRET:process.env.API_SECRET,
    OTP_SECRET:process.env.OTP_SECRET,
    PASS_SALT:process.env.PASS_SALT,
    TOKEN_SECRET:process.env.TOKEN_SECRET,
    ENVIRONMENT:process.env.ENVIRONMENT,
    UPLOAD_PRESETL:process.env.UPLOAD_PRESET,
  },
  nx: {
    svgr: false,
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
