const DevEnv = `${process.env.ENVIRONMENT}`==='development';
const DevEnvIsTesting = `${process.env.ENVIRONMENT}`==='testing';
const Onlocal = process.env.NODE_ENV === 'development';

console.log(process.env.ENVIRONMENT, 'devenv');
console.log(process.env.ENVIRONMENT, 'DevEnvIsTesting');
console.log(process.env.NODE_ENV, 'Onlocal');

export const giveTokenIndev = () => {
  if (Onlocal || DevEnv || DevEnvIsTesting )return  '675675e84bd85fce3de34006'
};