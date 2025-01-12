/* eslint-disable no-secrets/no-secrets */
import { green, red } from 'chalk';
import { execSync } from 'child_process';
import * as deployProject from '../../src/utils/deploy-project';

jest.mock('child_process');
describe('extractDeployedURLFromCommandResult', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('1. Should extract deployed URL from command output', () => {
    const app = 'yourApp';
    const deploymentCommand = 'test';
    const deploymentCommandResult = `Command output with \n https://${app}.com`;
    const mockLog = jest.spyOn(console, 'log').mockImplementation();

    const result = deployProject.extractDeployedURLFromCommandResult({
      app,
      deploymentCommandResult,
      deploymentCommand,
    });

    expect(result).toBe(`https://${app}.com`);
    expect(mockLog).toHaveBeenCalledWith(`${red(`${deploymentCommand} URL for ${app.toUpperCase()}`)}: ${green(`https://${app}.com`)}`);
    mockLog.mockRestore();
  });

  it('2. Should throw an error if app URL is not found', () => {
    const app = 'yourApp';
    const deploymentCommandResult = 'Command output without the app URL';
    const deploymentCommand = 'test';
    expect(() => deployProject.extractDeployedURLFromCommandResult({ app, deploymentCommandResult, deploymentCommand })).toThrowError(
      `${app} URL not found in the command output from this command result: ${deploymentCommandResult}`
    );
  });
});

describe('runDeploymentCommand', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('1. Should run deployment command and return result', () => {
    const app = 'yourApp';
    const previewCommand = 'your-preview-command';

    const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
    mockExecSync.mockReturnValueOnce(Buffer.from('Preview command output'));

    mockExecSync.mockReturnValueOnce(Buffer.from('Preview command output'));
    const mockLog = jest.spyOn(console, 'log').mockImplementation();

    deployProject.runDeploymentCommand({ deploymentCommand: previewCommand, app });

    expect(mockExecSync).toHaveBeenCalledWith(`npx nx ${previewCommand} ${app} --verbose`, { stdio: ['inherit'] });

    mockLog.mockRestore();
    mockExecSync.mockRestore();
  });
});

describe('deployProject', () => {
  jest.mock('../../src/utils/deploy-project.ts', () => ({
    runPreviewCommand: jest.fn(),
    extractDeployedURLFromCommandResult: jest.fn(),
  }));

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('1. Should test deployProject function', async () => {
    const app = 'yourApp';
    const previewCommand = 'your-preview-command';

    const mockRunDeploymentCommand = jest.spyOn(deployProject, 'runDeploymentCommand');
    mockRunDeploymentCommand.mockResolvedValueOnce(`Command output with \n https://${app}.com`);

    const mockExtractDeployedURLFromCommandResult = jest.spyOn(deployProject, 'extractDeployedURLFromCommandResult');
    mockExtractDeployedURLFromCommandResult.mockReturnValueOnce(`https://${app}.com`);
    const mockLog = jest.spyOn(console, 'log').mockImplementation();

    const result = await deployProject.deployProject({ app, deploymentCommand: previewCommand });

    expect(result).toBe(`https://${app}.com`);
    expect(mockRunDeploymentCommand).toHaveBeenCalledWith({ app: app, deploymentCommand: previewCommand });
    mockLog.mockRestore();
    mockRunDeploymentCommand.mockRestore();
    mockExtractDeployedURLFromCommandResult.mockRestore();
  });
});

describe('handleError', () => {
  it('1. Should throw an error with stdout message if error has stderr', () => {
    const errorWithStderr = { stderr: 'Some error occurred', stdout: 'Some output' };
    expect(() => deployProject.handleError(errorWithStderr)).toThrowError('Some output');
  });

  it('2. Should throw the original error if it does not have stderr', () => {
    const errorWithoutStderr = new Error('Some generic error');
    expect(() => deployProject.handleError(errorWithoutStderr)).toThrowError(errorWithoutStderr);
  });
});

describe('deployProjects', () => {
  jest.mock('../../src/utils/deploy-project', () => ({
    deployProject: jest.fn(),
  }));

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('1. Should deploy multiple projects', async () => {
    const affectedApps = ['app1', 'app2', 'app3'];
    const deploymentCommand = 'your-deployment-command';

    const mockDeployProject = jest.spyOn(deployProject, 'deployProject');
    mockDeployProject.mockImplementation(async ({ app }) => {
      return `https://${app}.com`;
    });

    const result = await deployProject.deployProjects(affectedApps, deploymentCommand);

    expect(result).toHaveLength(affectedApps.length);
    result.forEach((deployedProject, index) => {
      expect(deployedProject.name).toBe(affectedApps[index]);
      expect(deployedProject.url).toBe(`https://${affectedApps[index]}.com`);
    });
    expect(mockDeployProject).toHaveBeenCalledTimes(affectedApps.length);

    mockDeployProject.mockRestore();
  });

  it('2. Should handle deployment errors', async () => {
    const affectedApps = ['app1', 'app2', 'app3'];
    const deploymentCommand = 'your-deployment-command';

    const mockDeployProject = jest.spyOn(deployProject, 'deployProject');
    mockDeployProject.mockRejectedValueOnce(new Error('Deployment failed'));

    const mockHandleError = jest.spyOn(deployProject, 'handleError');
    mockHandleError.mockImplementation();
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    await deployProject.deployProjects(affectedApps, deploymentCommand);

    expect(mockDeployProject).toHaveBeenCalledTimes(1);
    expect(mockHandleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('Error occurred during deployment'));

    mockDeployProject.mockRestore();
    mockConsoleError.mockRestore();
  });
});
