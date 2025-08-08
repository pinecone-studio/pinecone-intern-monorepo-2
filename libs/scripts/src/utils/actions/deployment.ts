/* eslint-disable no-secrets/no-secrets */
import { getAffectedFederationProjects, getAffectedFederationServices } from '../affected/get-affected-federation-services';
import { deployProjects } from '../deploy-project';

export const deployAffectedProjects = async (affectedApps: string[], deploymentCommand: string) => {
  try {
    const federationServices = getAffectedFederationServices(affectedApps);

    const federationProjects = getAffectedFederationProjects(affectedApps).map(
      (project) => project.name
    );

    const otherProjects = affectedApps.filter(
      (app) => !federationProjects.includes(app) && !federationServices.includes(app)
    );

    const [
      deployedFederationServicesLinks,
      deployedFederationProjectsLinks,
      deployedOtherProjectsLinks
    ] = await Promise.all([
      deployProjects(federationServices, deploymentCommand),
      deployProjects(federationProjects, deploymentCommand),
      deployProjects(otherProjects, deploymentCommand),
    ]);

    return [
      ...deployedFederationServicesLinks,
      ...deployedOtherProjectsLinks,
      ...deployedFederationProjectsLinks
    ];
  } catch (error) {
    console.error('Error deploying affected projects:', error);
    throw new Error(
      `Error while running deployments for [${affectedApps.join(', ')}] with command "${deploymentCommand}": ${error}`
    );
  }
};
