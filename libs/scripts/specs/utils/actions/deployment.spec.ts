import * as deploymentUtils from '../../../src/utils/actions/deployment'; // Update with the correct module path
import * as deployProjectModule from '../../../src/utils/deploy-project';
import * as federationUtilsModule from '../../../src/utils/affected/get-affected-federation-services';

const affectedApps = ['app1', 'app2', 'int-universal-federation'];
describe('deployAffectedProjects', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should deploy affected projects correctly with federation', async () => {
    const deploymentCommand = 'your-deployment-command';

    const deployProjectsSpy = jest.spyOn(deployProjectModule, 'deployProjects');
    const deployProjectSpy = jest.spyOn(deployProjectModule, 'deployProject');
    const getAffectedFederationServicesSpy = jest.spyOn(federationUtilsModule, 'getAffectedFederationServices');
    const getAffectedFederationProjectsSpy = jest.spyOn(federationUtilsModule, 'getAffectedFederationProjects');

    getAffectedFederationServicesSpy.mockReturnValue(['service1', 'service2', 'int-universal-federation']);
    getAffectedFederationProjectsSpy.mockReturnValue([
      { name: 'project1', path: 'path' },
      { name: 'project2', path: 'path' },
    ]);
    deployProjectSpy.mockImplementation();
    deployProjectsSpy.mockResolvedValueOnce([{ name: 'test', url: 'http' }]);

    await deploymentUtils.deployAffectedProjects(affectedApps, deploymentCommand);

    expect(deployProjectsSpy).toHaveBeenCalledWith(['service1', 'service2', 'int-universal-federation'], deploymentCommand);
    expect(deployProjectsSpy).toHaveBeenCalledWith(['project1', 'project2'], deploymentCommand);
    expect(deployProjectsSpy).toHaveBeenCalledWith(['app1', 'app2'], deploymentCommand);
  });

  it('2. Should deploy affected projects correctly without federation', async () => {
    const affectedApps = ['app1', 'app2'];
    const deploymentCommand = 'your-deployment-command';

    const deployProjectsSpy = jest.spyOn(deployProjectModule, 'deployProjects');
    const deployProjectSpy = jest.spyOn(deployProjectModule, 'deployProject');
    const getAffectedFederationServicesSpy = jest.spyOn(federationUtilsModule, 'getAffectedFederationServices');
    const getAffectedFederationProjectsSpy = jest.spyOn(federationUtilsModule, 'getAffectedFederationProjects');

    getAffectedFederationServicesSpy.mockReturnValue(['service1', 'service2']);
    getAffectedFederationProjectsSpy.mockReturnValue([
      { name: 'project1', path: 'path' },
      { name: 'project2', path: 'path' },
    ]);
    deployProjectSpy.mockImplementation();
    deployProjectsSpy.mockResolvedValueOnce([{ name: 'test', url: 'http' }]);

    await deploymentUtils.deployAffectedProjects(affectedApps, deploymentCommand);

    expect(deployProjectsSpy).toHaveBeenCalledWith(['service1', 'service2'], deploymentCommand);
    expect(deployProjectsSpy).toHaveBeenCalledWith(['project1', 'project2'], deploymentCommand);
    expect(deployProjectsSpy).toHaveBeenCalledWith(['app1', 'app2'], deploymentCommand);
  });
  it('3. Should handle error during deployment', async () => {
    const affectedApps = ['app1', 'app2', 'int-universal-federation'];
    const deploymentCommand = 'your-deployment-command';

    const deployProjectsSpy = jest.spyOn(deployProjectModule, 'deployProjects');
    const getAffectedFederationServicesSpy = jest.spyOn(federationUtilsModule, 'getAffectedFederationServices');
    const getAffectedFederationProjectsSpy = jest.spyOn(federationUtilsModule, 'getAffectedFederationProjects');

    getAffectedFederationServicesSpy.mockReturnValue(['service1', 'service2']);
    getAffectedFederationProjectsSpy.mockReturnValue([
      { name: 'project1', path: 'path' },
      { name: 'project2', path: 'path' },
    ]);

    deployProjectsSpy.mockRejectedValueOnce(new Error('Deployment failed'));

    try {
      await deploymentUtils.deployAffectedProjects(affectedApps, deploymentCommand);
    } catch (error) {
      expect(error.message).toBe(`Error while running deployments for [${affectedApps.join(', ')}] with command "${deploymentCommand}": Error: Deployment failed`);
    }

    expect(deployProjectsSpy).toHaveBeenCalledWith(['service1', 'service2'], deploymentCommand);
  });
});
