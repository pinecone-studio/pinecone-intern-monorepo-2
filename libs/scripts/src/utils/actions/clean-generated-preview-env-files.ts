import * as fs from 'fs';
import path from 'path';
import { getAffectedFederationServices } from '../affected';

export const envGeneratedPaths = ['apps/GLMS/glms-dashboard', 'apps/federation', 'apps/HRMS/hrms-dashboard'];

export const cleanGeneratedPreviewEnvFiles = () => {
  envGeneratedPaths.forEach((relativePath) => {
    const filePath = path.join(__dirname, relativePath, '.env.preview');

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`.env.preview file removed successfully from ${relativePath}.`);
    } else {
      console.log(`.env.preview file not found in ${relativePath}.`);
    }
  });
};

const hasNoFederationServices = (federationServices: string[], affectedServices: string[]): boolean => {
  return federationServices.length === 0 || affectedServices.includes('federation');
};

export const shouldAddFederationToAffected = (affectedServices: string[]): string[] => {
  const federationServices = getAffectedFederationServices(affectedServices);

  if (hasNoFederationServices(federationServices, affectedServices)) {
    return affectedServices;
  }

  return [...affectedServices, 'federation'];
};
