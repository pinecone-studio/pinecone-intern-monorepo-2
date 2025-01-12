import { green } from 'chalk';
import * as deployProject from '../../../src/utils/deploy-project';
import * as checkFederationResponse from '../../../src/utils/federation/check-federation-response';
import * as federationServicesAction from '../../../src/utils/federation/federation-services-action-utils';
import * as getAffectedFederationServices from '../../../src/utils/affected/get-affected-federation-services';

describe('GenerateFederationPreviewUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('1. Should generate a preview URL for the specified service', async () => {
    const mockServiceName = 'test';
    const mockDeployProject = jest.spyOn(deployProject, 'deployProject');
    mockDeployProject.mockResolvedValueOnce('https');
    const result = await federationServicesAction.generateFederationPreviewUrl(mockServiceName);
    expect(mockDeployProject).toHaveBeenCalledWith({ app: mockServiceName, deploymentCommand: 'preview' });
    expect(result).toBe('https/graphql');
  });
});

describe('getFederationPreviewUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('1. Should generate the federation preview URL', async () => {
    const mockServices = ['service1', 'service2', 'federation'];
    const mockFilteredServices = ['service1', 'service2'];

    const spyDeployProject = jest.spyOn(deployProject, 'deployProject');
    spyDeployProject.mockResolvedValueOnce('http');

    const spyGenerateFederationPreviewUrl = jest.spyOn(federationServicesAction, 'generateFederationPreviewUrl');
    spyGenerateFederationPreviewUrl.mockResolvedValueOnce('https://federation-preview-url/graphql');

    const spyCheckFederationGeneratedPreviewUrl = jest.spyOn(checkFederationResponse, 'checkFederationResponse');
    spyCheckFederationGeneratedPreviewUrl.mockResolvedValue(true);

    const result = await federationServicesAction.getFederationPreviewUrl(mockServices);

    expect(spyDeployProject).toHaveBeenCalledTimes(mockFilteredServices.length);
    mockFilteredServices.forEach((service) => {
      expect(spyDeployProject).toHaveBeenCalledWith({ app: service, deploymentCommand: 'preview' });
    });
    expect(spyGenerateFederationPreviewUrl).toHaveBeenCalledWith('federation');
    expect(spyCheckFederationGeneratedPreviewUrl).toHaveBeenCalledWith('https://federation-preview-url/graphql');
    expect(result).toBe('https://federation-preview-url/graphql');
  });
});

describe('generateFederationPreview', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('1. Should generate the federation preview', async () => {
    const mockAffectedApps = ['app1', 'app2'];
    const mockAffectedServices = ['service1', 'service2'];

    const spyGetAffectedFederationServices = jest.spyOn(getAffectedFederationServices, 'getAffectedFederationServices');
    spyGetAffectedFederationServices.mockReturnValueOnce(mockAffectedServices);

    const spyGetFederationPreviewUrl = jest.spyOn(federationServicesAction, 'getFederationPreviewUrl');
    spyGetFederationPreviewUrl.mockResolvedValueOnce('https://federation-preview-url/graphql');

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = await federationServicesAction.generateFederationPreview(mockAffectedApps);

    expect(spyGetAffectedFederationServices).toHaveBeenCalledWith(mockAffectedApps);
    expect(consoleLogSpy).toHaveBeenCalledWith(green(`Affected federation services ${JSON.stringify(mockAffectedServices)}`));
    expect(spyGetFederationPreviewUrl).toHaveBeenCalledWith(mockAffectedServices);
    expect(result).toBe('https://federation-preview-url/graphql');
  });
});
