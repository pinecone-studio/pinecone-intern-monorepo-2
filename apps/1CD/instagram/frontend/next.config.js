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
    BACKEND_URI: process.env.BACKEND_URI,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    LOCAL_BACKEND_URI: process.env.LOCAL_BACKEND_URI,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*',
        // protocol: 'https',
      },
    ],
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
