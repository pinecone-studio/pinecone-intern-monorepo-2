import * as fs from 'fs';

export type AffectedProjectType = {
  name: string;
  path: string;
};

const federationMicroservicesPath = 'apps/federation/.env.testing';
const federationProjectsPath = 'apps/federation/.env.projects';

export const parseMicroserviceName = (line: string): string => {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
  return match ? match[1].toLowerCase().replace(/_/g, '-') : '';
};

export const checkFileExistence = (path: string): void => {
  if (!fs.existsSync(path)) {
    throw new Error(`Could not find any file on this path: ${path}`);
  }
};

export const readFileIfExists = (path: string): string => {
  checkFileExistence(path);
  return fs.readFileSync(path, 'utf-8');
};

export const getFederationServices = (): Set<string> => {
  const fileContent = readFileIfExists(federationMicroservicesPath);
  return new Set(fileContent.split('\n').map(parseMicroserviceName));
};

export const getFederationProjects = (): Set<AffectedProjectType> => {
  const fileContentSet = new Set(readFileIfExists(federationProjectsPath).split('\n'));
  const projects = new Set<AffectedProjectType>();

  fileContentSet.forEach((line) => {
    const match = RegExp(/^([^=]+)=(.+)$/).exec(line);
    if (match) {
      const projectName = match[1].trim().toLowerCase().replace(/_/g, '-');
      const projectPath = match[2].trim();
      projects.add({ name: projectName, path: projectPath });
    }
  });

  return projects;
};

export const getAffectedFederationServices = (affectedApps: string[]): string[] => {
  const federationServices = getFederationServices();
  return affectedApps.filter((app) => federationServices.has(app) || app === 'federation');
};

export const getAffectedFederationProjects = (affectedApps: string[]): AffectedProjectType[] => {
  const projects = getFederationProjects();
  return affectedApps
    .map((app) => {
      const matchingProject = Array.from(projects).find((project) => project.name === app);
      return matchingProject ? { name: matchingProject.name, path: matchingProject.path } : null;
    })
    .filter(Boolean) as AffectedProjectType[];
};
