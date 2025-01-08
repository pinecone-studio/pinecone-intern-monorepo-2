const DevEnv = `${process.env.ENVIRONEMNT}`==='production';
const Onlocal = process.env.NODE_ENV === 'development';

export const giveTokenIndev = () => {
  if (Onlocal || !DevEnv ) return  '675675e84bd85fce3de34006'
};