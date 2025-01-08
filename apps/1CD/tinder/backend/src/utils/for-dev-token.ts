const DevEnv = `${process.env.ENVIRONEMNT}`==='development';
const DevEnvIsTesting = `${process.env.ENVIRONEMNT}`==='testing';
const Onlocal = process.env.NODE_ENV === 'development';

export const giveTokenIndev = () => {
  if (Onlocal || DevEnv || DevEnvIsTesting ) return  '675675e84bd85fce3de34006'
};