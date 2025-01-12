/* eslint-disable no-secrets/no-secrets */
import * as deployProdAction from '../../../src/actions/deployment/deploy-prod-action';
import * as deploymentUtils from '../../../src/utils/actions/deployment';
import * as getAffectedApps from '../../../src/utils/affected/get-affected-apps';

jest.mock('../../../src/utils/actions/deployment', () => ({
  deployAffectedProjects: jest.fn(),
}));

describe('runDeployProdAction', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockAffectedProjects = ['project1', 'project2'];
  it('1. Should deploy affected project to prod and return deployed link', async () => {
    const mockGetAffectedApps = jest.spyOn(getAffectedApps, 'getAffectedApps');
    mockGetAffectedApps.mockImplementation(() => {
      return mockAffectedProjects;
    });
    const mockDeployAffectedProjects = jest.spyOn(deploymentUtils, 'deployAffectedProjects');
    mockDeployAffectedProjects.mockResolvedValueOnce([{ name: 'test', url: 'http' }]);

    await deployProdAction.runDeployProdAction();

    expect(mockDeployAffectedProjects).toHaveBeenCalledWith(mockAffectedProjects, 'deploy-prod');
  });

  it('2. Should exit with code 1 if an error occurs', async () => {
    const mockGetAffectedApps = jest.spyOn(getAffectedApps, 'getAffectedApps');
    mockGetAffectedApps.mockImplementation(() => {
      return mockAffectedProjects;
    });

    const mockDeployAffectedProjects = jest.spyOn(deploymentUtils, 'deployAffectedProjects');
    mockDeployAffectedProjects.mockImplementation(() => {
      throw new Error('Error');
    });

    const mockProcessExit = jest.spyOn(process, 'exit').mockImplementation();

    await deployProdAction.runDeployProdAction();

    expect(mockProcessExit).toHaveBeenCalledWith(1);
    mockProcessExit.mockRestore();
  });
});
