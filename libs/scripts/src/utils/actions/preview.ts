import { getAffectedFederationProjects, getAffectedFederationServices } from '../affected';
import { deployProject } from '../deploy-project';
import { ProjectPreview, generateFederationProjectsPreview } from '../federation/federation-projects-action-utils';
import { generateFederationPreview } from '../federation/federation-services-action-utils';

export const handleAffectedFederationServices = async (affectedApps: string[]) => {
  const previewUrl = await generateFederationPreview(affectedApps);
  return previewUrl;
};

export const handleAffectedFederationProjects = async (affectedApps: string[], federationPreviewUrl: boolean | string): Promise<ProjectPreview[]> => {
  try {
    const projects = getAffectedFederationProjects(affectedApps);
    const previewResults = await generateFederationProjectsPreview(projects, federationPreviewUrl);
    return previewResults;
  } catch (error) {
    console.error('Error handling affected federation projects:', error);
    throw new Error(`Failed to handle affected federation projects: ${error.stack}`);
  }
};

export const runGeneratePreviewCommandOnOtherProjects = async (otherApps: string[]): Promise<ProjectPreview[]> => {
  const otherProjectsPreview: ProjectPreview[] = [];
  for (const app of otherApps) {
    const previewLink = await deployProject({ app: app, deploymentCommand: 'preview' });
    otherProjectsPreview.push({ name: app, url: previewLink });
  }
  return otherProjectsPreview;
};

export const handleOtherProjects = async (affectedApps: string[]): Promise<ProjectPreview[]> => {
  try {
    const federationProjects = getAffectedFederationProjects(affectedApps);
    const federationServices = getAffectedFederationServices(affectedApps);
    const otherApps = affectedApps.filter((app) => !federationProjects.some((project) => project.name === app) && !federationServices.includes(app));
    return await runGeneratePreviewCommandOnOtherProjects(otherApps);
  } catch (error) {
    console.error('Error handling other projects:', error);
    throw new Error(`Failed to handle other projects: ${error.stack}`);
  }
};
