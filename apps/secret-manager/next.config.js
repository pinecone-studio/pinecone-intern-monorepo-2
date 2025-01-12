//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  env: {
    MONGO_URI: 'mongodb+srv://developer:IqORt9VO7B4zTKF5@cluster0.zd5kvja.mongodb.net/secrets?retryWrites=true&w=majority&appName=Cluster0',
  },
  nx: {
    svgr: false,
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
