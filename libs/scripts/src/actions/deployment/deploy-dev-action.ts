/* eslint-disable no-secrets/no-secrets */
import { green, red } from 'chalk';
import { cleanGeneratedPreviewEnvFiles, shouldAddFederationToAffected } from '../../utils/actions/clean-generated-preview-env-files';
import { deployAffectedProjects } from '../../utils/actions/deployment';
import { getAffectedApps } from '../../utils/affected/get-affected-apps';

export const runDeployDevAction = async () => {
  cleanGeneratedPreviewEnvFiles();
  const affectedApps = getAffectedApps('--with-target deploy-dev');
  try {
    console.log(green(`Affected projects and services ${JSON.stringify(affectedApps)}`));
    const deployedLinks = await deployAffectedProjects(shouldAddFederationToAffected(affectedApps), 'deploy-dev');
    console.log(deployedLinks);
  } catch (error) {
    console.log(red(error.message));

    process.exit(1);
  }
};

runDeployDevAction();
