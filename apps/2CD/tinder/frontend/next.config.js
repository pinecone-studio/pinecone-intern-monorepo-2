//@ts-check
 
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
 
/**
* @type {import('@nx/next/plugins/with-nx').WithNxOptions}
**/
const nextConfig = {
  env: {
    NEXT_PUBLIC_LOCAL_BACKEND_URI: process.env.LOCAL_BACKEND_URI,
  },
  nx: {
    svgr: false,
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