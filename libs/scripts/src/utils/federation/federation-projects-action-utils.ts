import { green } from 'chalk';
import * as fs from 'fs/promises';
import path from 'path';
import { deployProject } from '../../utils/deploy-project';
import { deleteExistingPreviewFile } from './federation-services-action-utils';

interface Project {
  name: string;
  path: string;
}

export interface ProjectPreview {
  name: string;
  url: string;
}

const ENV_DEVELOPMENT_PATH = '.env.development';
const ENV_PREVIEW_PATH = '.env.preview';

export const generateFederationEnvFile = async ({ name: projectName, path: projectPath }: Project, federationPreviewUrl: string): Promise<boolean> => {
  try {
    const envDevelopmentPath = path.join(projectPath, ENV_DEVELOPMENT_PATH);
    const envPreviewPath = path.join(projectPath, ENV_PREVIEW_PATH);

    const envDevelopmentContent = await fs.readFile(envDevelopmentPath, 'utf-8');
    const updatedContent = envDevelopmentContent
      .replace(/(FEDERATION_ENDPOINT_FOR_CODEGEN=")[^"]*"/, `$1${federationPreviewUrl}"`)
      .replace(/(FEDERATION_ENDPOINT=")[^"]*"/, `$1${federationPreviewUrl}"`)
      .replace(/(ENVIRONMENT=")[^"]*"/, `$1PREVIEW"`);

    await fs.writeFile(envPreviewPath, updatedContent);

    console.log(`.env.preview file generated successfully at ${envPreviewPath}`);
    return true;
  } catch (error) {
    console.error(`Error generating .env.preview file for project ${projectName}:`, error);
    throw new Error(`Failed to generate .env.preview file for project ${projectName}: ${error}`);
  }
};

export const generatePreviewLinksForProjects = async (projects: Project[]): Promise<ProjectPreview[]> => {
  try {
    const previewLinks: ProjectPreview[] = await Promise.all(
      projects.map(async ({ name }) => {
        const previewLink = await deployProject({ app: name, deploymentCommand: 'preview' });
        return { name: `${name} without federation preview`, url: previewLink };
      })
    );
    return previewLinks;
  } catch (error) {
    console.error('Error generating preview links for projects:', error);
    throw new Error(`Failed to generate preview links for projects: ${error}`);
  }
};

export const processProject = async (project: Project, federationPreviewUrl: string): Promise<ProjectPreview> => {
  const { name: projectName, path: projectPath } = project;
  const envPreviewPath = path.join(projectPath, ENV_PREVIEW_PATH);
  deleteExistingPreviewFile(envPreviewPath);
  await generateFederationEnvFile(project, federationPreviewUrl);
  const federationProjectPreviewLink = await deployProject({ app: projectName, deploymentCommand: 'preview-all' });
  return { name: `${projectName} with federation preview`, url: federationProjectPreviewLink };
};

const generateAffectedProjectsPreviewLinks = async (projects: Project[], federationPreviewUrl: string): Promise<ProjectPreview[]> => {
  const previewLinks: ProjectPreview[] = [];

  for (const project of projects) {
    const previewLink = await processProject(project, federationPreviewUrl);
    previewLinks.push(previewLink);
  }

  return previewLinks;
};

export const generateFederationEnvFilesAndPreviewLinks = async (projects: Project[], federationPreviewUrl: string): Promise<ProjectPreview[]> => {
  try {
    const previewLinks = await generateAffectedProjectsPreviewLinks(projects, federationPreviewUrl);
    return previewLinks;
  } catch (error) {
    console.error('Error generating env files and preview links:', error);
    throw new Error(`Failed to generate env files and preview links: ${error}`);
  }
};

const generatePreviewLinksBasedOnUrl = async (projects: Project[], federationPreviewUrl?: string | boolean): Promise<ProjectPreview[]> => {
  if (!federationPreviewUrl) {
    const federationProjectsWithPreviewUrl = await generatePreviewLinksForProjects(projects);
    return federationProjectsWithPreviewUrl;
  } else {
    const envFileAndPreviewLinks = await generateFederationEnvFilesAndPreviewLinks(projects, federationPreviewUrl as string);
    return envFileAndPreviewLinks;
  }
};

export const generateFederationProjectsPreview = async (projects: Project[], federationPreviewUrl?: string | boolean): Promise<ProjectPreview[]> => {
  console.log(green(`Affected federation projects: ${JSON.stringify(projects)}`));
  return await generatePreviewLinksBasedOnUrl(projects, federationPreviewUrl);
};
