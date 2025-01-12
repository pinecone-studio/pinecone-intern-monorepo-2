import { green } from 'chalk';
import * as fs from 'fs';
import { deployProject, deployProjects } from '../../utils/deploy-project';
import { checkFederationResponse } from './check-federation-response';
import { getAffectedFederationServices } from '../affected';

interface AffectedServiceType {
  name: string;
  url: string;
}

const federationProjectPath = 'apps/federation';
const envTestingPath = `${federationProjectPath}/.env.testing`;
const envPreviewPath = `${federationProjectPath}/.env.preview`;

export const deleteExistingPreviewFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const updatePreviewFile = (envPath: string, key: string, link: string): void => {
  fs.appendFileSync(envPath, `${key}=${link}/api/graphql`);
};

export const writePreviewFile = (envPath: string, content: string): void => {
  fs.appendFileSync(envPath, `${content}\n`);
};

export const handleAffectedService = (service: AffectedServiceType, updatedLine: string, originalLine: string, envPath: string, replaced: boolean): boolean => {
  const modifiedProject = updatedLine.toLowerCase().replace(/_/g, '-');

  if (service.name === modifiedProject) {
    const key = originalLine.split('=')[0];
    updatePreviewFile(envPath, key, service.url);
    return true;
  }

  return replaced;
};

export const processEnvTestingLine = (line: string, affectedServices: AffectedServiceType[], envPath: string): void => {
  let replaced = false;
  const [updatedLine] = line.split('=');

  affectedServices.forEach((service) => {
    replaced = handleAffectedService(service, updatedLine, line, envPath, replaced);
  });

  writePreviewFile(envPath, replaced ? '' : line);
};

export const generatePreviewEnv = (affectedServices: AffectedServiceType[]): void => {
  deleteExistingPreviewFile(envPreviewPath);
  const envTestingContent = fs.readFileSync(envTestingPath, 'utf-8').split('\n');

  for (const line of envTestingContent) {
    processEnvTestingLine(line, affectedServices, envPreviewPath);
  }
};

export const generateFederationPreviewUrl = async (serviceName: string): Promise<string> => {
  const previewLink = await deployProject({ app: serviceName, deploymentCommand: 'preview' });
  return `${previewLink}/graphql`;
};

export const getFederationPreviewUrl = async (services: string[]): Promise<string> => {
  const affectedServices = services.filter((service) => service !== 'federation');

  const deployedAffectedServices = await deployProjects(affectedServices, 'preview');
  console.log(deployedAffectedServices);

  generatePreviewEnv(deployedAffectedServices as unknown as AffectedServiceType[]);

  const federationUrl = await generateFederationPreviewUrl('federation');
  await checkFederationResponse(federationUrl);

  return federationUrl;
};

export const generateFederationPreview = async (affectedApps: string[]): Promise<boolean | string> => {
  const affectedServices = getAffectedFederationServices(affectedApps);
  console.log(green(`Affected federation services ${JSON.stringify(affectedServices)}`));
  return affectedServices.length > 0 && getFederationPreviewUrl(affectedServices);
};
