import * as copyFile from '../../src/utils/commands/federation/copy-dev-to-local-env';
import * as executeServices from '../../src/utils/commands/federation/run-selected-services';
import * as runFederationLocally from '../../src/utils/commands/federation/run-federation-locally';
import * as runDevLocalCommandOnFederation from './../../src/commands/dev-local-federation-command';
import * as getAffectedApps from '../../src/utils/affected/get-affected-apps';
import * as getAffectedFederationServices from '../../src/utils/affected/get-affected-federation-services';

jest.mock('../../src/utils/commands/federation/run-selected-services');

describe('runDevLocalCommandOnFederation', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should run successfully when services are selected', async () => {
    const mockCopyDevToLocalEnv = jest.spyOn(copyFile, 'copyDevToLocalEnv');
    const mockGetAffectedApps = jest.spyOn(getAffectedApps, 'getAffectedApps');
    const mockGetAffectedFederationServices = jest.spyOn(getAffectedFederationServices, 'getAffectedFederationServices');
    const mockRunSelectedServices = jest.spyOn(executeServices, 'runSelectedServices');
    const mockRunFederationLocally = jest.spyOn(runFederationLocally, 'runFederationLocally');

    mockCopyDevToLocalEnv.mockImplementation();
    mockGetAffectedApps.mockReturnValue(['app1', 'app2']);
    mockGetAffectedFederationServices.mockReturnValue(['service1', 'service2']);
    mockRunSelectedServices.mockResolvedValue();
    mockRunFederationLocally.mockImplementation();

    await runDevLocalCommandOnFederation.runDevLocalCommandOnFederation();

    expect(mockGetAffectedApps).toHaveBeenCalled();
    expect(mockGetAffectedFederationServices).toHaveBeenCalledWith(['app1', 'app2']);
    expect(mockRunSelectedServices).toHaveBeenCalled();
    expect(mockRunFederationLocally).toHaveBeenCalled();
  });

  it('1. Should handle error during runDevLocalCommandOnFederation', async () => {
    const error = new Error('File copying error');
    const mockCopyFile = jest.spyOn(copyFile, 'copyDevToLocalEnv');
    mockCopyFile.mockImplementation(() => {
      throw error;
    });

    const exitProcessSpy = jest.spyOn(process, 'exit').mockImplementation();

    const mockExecuteServices = jest.spyOn(executeServices, 'runSelectedServices');
    mockExecuteServices.mockImplementation();

    await runDevLocalCommandOnFederation.runDevLocalCommandOnFederation();

    expect(exitProcessSpy).toHaveBeenCalledWith(1);
    exitProcessSpy.mockRestore();
  });
});
