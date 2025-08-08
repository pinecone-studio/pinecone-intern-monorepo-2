import '../polyfills';
import chalk from 'chalk';
import { copyDevToLocalEnv, getAffectedApps, getAffectedFederationServices, runFederationLocally, runSelectedServices } from '../utils';

const FEDERATION_DEV_ENV_PATH = 'apps/federation/.env.development';
const FEDERATION_LOCAL_ENV_PATH = 'apps/federation/.env.local';

const getAffectedOrSelectedServices = () => {
  const [, , ...selectedServices] = process.argv;
  const affectedServices = getAffectedApps();
  const allServices = [...affectedServices, ...selectedServices];
  const uniqueServices = new Set(allServices);
  const affectedFederationServices = getAffectedFederationServices([...uniqueServices]);
  return affectedFederationServices.filter((service) => service !== 'federation');
};

export const runDevLocalCommandOnFederation = async () => {
  try {
    copyDevToLocalEnv(FEDERATION_DEV_ENV_PATH, FEDERATION_LOCAL_ENV_PATH);
    const services = getAffectedOrSelectedServices();
    if (services.length !== 0) {
      await Promise.all(services.map(runSelectedServices));
    }
    runFederationLocally();
  } catch (err) {
    console.log(chalk.red(`error occurred when running federation locally, ${err}`));
    process.exit(1);
  }
};

runDevLocalCommandOnFederation();
