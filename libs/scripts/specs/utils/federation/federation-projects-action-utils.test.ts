/* eslint-disable max-lines */
/* eslint-disable no-secrets/no-secrets */
import { green } from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import * as deployProject from '../../../src/utils/deploy-project';
import * as federationProjectsAction from '../../../src/utils/federation/federation-projects-action-utils';
import * as federationServicesAction from '../../../src/utils/federation/federation-services-action-utils';

jest.mock('fs/promises');

describe('generateFederationEnvFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should generates .env.preview file with the correct content', async () => {
    const projectName = 'testProject';
    const projectPath = '/path/to/project';
    const federationPreviewUrl = 'https://example.com/federation';

    const envDevelopmentPath = path.join(projectPath, '.env.development');
    const envPreviewPath = path.join(projectPath, '.env.preview');

    const mockEnvDevelopmentContent = 'FEDERATION_ENDPOINT_FOR_CODEGEN="https://example.com/development"';
    const expectedUpdatedContent = 'FEDERATION_ENDPOINT_FOR_CODEGEN="https://example.com/federation"';

    const spyDeployProject = jest.spyOn(deployProject, 'deployProject');
    spyDeployProject.mockResolvedValueOnce('http');

    jest.spyOn(fs, 'readFile').mockResolvedValue(mockEnvDevelopmentContent);
    const writeFileMock = jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);

    await federationProjectsAction.generateFederationEnvFile({ name: projectName, path: projectPath }, federationPreviewUrl);

    expect(fs.readFile).toHaveBeenCalledWith(envDevelopmentPath, 'utf-8');
    expect(writeFileMock).toHaveBeenCalledWith(envPreviewPath, expectedUpdatedContent);
  });

  it('2. Should handles errors during file generation', async () => {
    const projectName = 'testProject';
    const projectPath = '/path/to/project';
    const federationPreviewUrl = 'https://example.com/federation';

    jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('Read file error'));

    await expect(federationProjectsAction.generateFederationEnvFile({ name: projectName, path: projectPath }, federationPreviewUrl)).rejects.toThrowError(
      /Failed to generate .env.preview file for project testProject/
    );
  });
});

describe('generatePreviewLinksForProjects', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should generates preview links for each project', async () => {
    const projects = [
      { name: 'project1', path: 'test/path' },
      { name: 'project2', path: 'test/path' },
    ];

    const spyDeployProject = jest.spyOn(deployProject, 'deployProject');
    spyDeployProject.mockResolvedValueOnce('http');

    await federationProjectsAction.generatePreviewLinksForProjects(projects);

    expect(spyDeployProject).toHaveBeenCalledTimes(projects.length);
    projects.forEach((project) => {
      expect(spyDeployProject).toHaveBeenCalledWith({ app: project.name, deploymentCommand: 'preview' });
    });
  });

  it('2. Should handles errors during preview link generation', async () => {
    const projects = [
      { name: 'project1', path: 'test/path' },
      { name: 'project2', path: 'test/path' },
    ];

    const errorMessage = 'An error occurred during preview link generation';
    const mockDeployProject = jest.spyOn(deployProject, 'deployProject');
    mockDeployProject.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(federationProjectsAction.generatePreviewLinksForProjects(projects)).rejects.toThrowError(new RegExp(errorMessage));

    expect(mockDeployProject).toHaveBeenCalledTimes(projects.length);
    projects.forEach((project) => {
      expect(mockDeployProject).toHaveBeenCalledWith({ app: project.name, deploymentCommand: 'preview' });
    });
  });
});

describe('generateFederationEnvFilesAndPreviewLinks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('1. Should generate env files and preview links for each project', async () => {
    const projects = [{ name: 'project1', path: '/path/to/project1' }];

    const federationPreviewUrl = 'https://federation-preview-url';

    const mockDeleteExistingPreviewFile = jest.spyOn(federationServicesAction, 'deleteExistingPreviewFile');
    mockDeleteExistingPreviewFile.mockReturnValueOnce();

    const mockGenerateFederationEnvFile = jest.spyOn(federationProjectsAction, 'generateFederationEnvFile');
    mockGenerateFederationEnvFile.mockResolvedValueOnce(Promise.resolve(true));

    const mockDeployProject = jest.spyOn(deployProject, 'deployProject');
    mockDeployProject.mockResolvedValueOnce('http');

    await federationProjectsAction.generateFederationEnvFilesAndPreviewLinks(projects, federationPreviewUrl);

    projects.forEach(({ name, path }) => {
      expect(mockGenerateFederationEnvFile).toHaveBeenCalledWith({ name, path }, federationPreviewUrl);
    });
    projects.forEach(({ name }) => {
      expect(mockDeployProject).toHaveBeenCalledWith({ app: name, deploymentCommand: 'preview-all' });
    });
    expect(mockDeleteExistingPreviewFile).toHaveBeenCalledTimes(projects.length);
    expect(mockGenerateFederationEnvFile).toHaveBeenCalledTimes(projects.length);
    expect(mockDeployProject).toHaveBeenCalledTimes(projects.length);
  });

  it('2. Should throw error while generating federation project env file and preview link', async () => {
    const projects = [{ name: 'project1', path: '/path/to/project1' }];

    const federationPreviewUrl = 'https://federation-preview-url';

    const mockDeleteExistingPreviewFile = jest.spyOn(federationServicesAction, 'deleteExistingPreviewFile');
    mockDeleteExistingPreviewFile.mockReturnValueOnce();

    const mockGenerateFederationEnvFile = jest.spyOn(federationProjectsAction, 'generateFederationEnvFile');
    mockGenerateFederationEnvFile.mockResolvedValueOnce(Promise.resolve(true));

    const mockDeployProject = jest.spyOn(deployProject, 'deployProject');
    mockDeployProject.mockResolvedValueOnce('http');

    const mockProcessProject = jest.spyOn(federationProjectsAction, 'processProject');
    mockProcessProject.mockRejectedValueOnce(new Error('Simulated error'));

    try {
      await federationProjectsAction.generateFederationEnvFilesAndPreviewLinks(projects, federationPreviewUrl);
    } catch (error) {
      expect(error.message).toBe('Failed to generate env files and preview links: Error: Simulated error');
    }

    mockProcessProject.mockReset();
  });
});

describe('generateFederationProjectsPreview', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should generate preview links for projects if federationPreviewUrl is falsy', async () => {
    const projects = [
      { name: 'project1', path: '/path/to/project1' },
      { name: 'project2', path: '/path/to/project2' },
    ];

    const federationPreviewUrl: string | boolean = false;
    const mockConsoleLog = jest.spyOn(console, 'log');
    const mockGeneratePreviewLinksForProjects = jest.spyOn(federationProjectsAction, 'generatePreviewLinksForProjects');
    const mockPreviewLinks = [
      { name: 'project1', url: 'https://preview-link-1' },
      { name: 'project2', url: 'https://preview-link-2' },
    ];
    mockGeneratePreviewLinksForProjects.mockResolvedValueOnce(mockPreviewLinks);

    const result = await federationProjectsAction.generateFederationProjectsPreview(projects, federationPreviewUrl);

    expect(result).toEqual(mockPreviewLinks);
    expect(mockConsoleLog).toHaveBeenCalledWith(green(`Affected federation projects: ${JSON.stringify(projects)}`));
    expect(mockGeneratePreviewLinksForProjects).toHaveBeenCalledWith(projects);
  });

  it('2. Should generate env files and preview links for projects if federationPreviewUrl is truthy', async () => {
    const projects = [
      { name: 'project1', path: '/path/to/project1' },
      { name: 'project2', path: '/path/to/project2' },
    ];

    const federationPreviewUrl: string | boolean = 'https://federation-preview-url';
    const mockConsoleLog = jest.spyOn(console, 'log');
    const mockGeneratePreviewLinksForProjects = jest.spyOn(federationProjectsAction, 'generatePreviewLinksForProjects');
    const mockPreviewLinks = [
      { name: 'project1', url: 'https://preview-link-1' },
      { name: 'project2', url: 'https://preview-link-2' },
    ];
    mockGeneratePreviewLinksForProjects.mockResolvedValueOnce(mockPreviewLinks);

    const mockGenerateFederationEnvFilesAndPreviewLinks = jest.spyOn(federationProjectsAction, 'generateFederationEnvFilesAndPreviewLinks');
    const mockEnvFilesAndPreviewLinks = [
      { name: 'project1', url: 'https://preview-link-1' },
      { name: 'project2', url: 'https://preview-link-2' },
    ];
    mockGenerateFederationEnvFilesAndPreviewLinks.mockResolvedValueOnce(mockEnvFilesAndPreviewLinks);

    const result = await federationProjectsAction.generateFederationProjectsPreview(projects, federationPreviewUrl);

    expect(result).toEqual(mockEnvFilesAndPreviewLinks);
    expect(mockConsoleLog).toHaveBeenCalledWith(green(`Affected federation projects: ${JSON.stringify(projects)}`));
    expect(mockGenerateFederationEnvFilesAndPreviewLinks).toHaveBeenCalledWith(projects, federationPreviewUrl);
  });
});
