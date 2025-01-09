const DevEnv = `${process.env.ENVIRONMENT}`==='development';
const DevEnvIsTesting = `${process.env.ENVIRONMENT}`==='testing';
const Onlocal = process.env.NODE_ENV === 'development';

export const giveTokenIndev = () => {
  console.log({Onlocal, DevEnv, DevEnvIsTesting},'Onlocal || DevEnv || DevEnvIsTesting')
  
  if (Onlocal || DevEnv || DevEnvIsTesting )return  '675675e84bd85fce3de34006'
};