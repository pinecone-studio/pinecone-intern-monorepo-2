import * as previewActionUtils from '../../../src/utils/actions/preview';
import * as deployProject from '../../../src/utils/deploy-project';
import * as generateFederationProjectsPreview from '../../../src/utils/federation/federation-projects-action-utils';
import * as generateFederationPreview from '../../../src/utils/federation/federation-services-action-utils';
import * as federationUtils from '../../../src/utils/affected/get-affected-federation-services';
import * as getAffectedApps from '../../../src/utils/affected/get-affected-apps';

jest.mock('../../../src/utils/deploy-project', () => ({
  deployProject: jest.fn(),
}));

jest.mock('../../../src/utils/federation/federation-services-action-utils', () => ({
  generateFederationPreview: jest.fn(),
}));

const affectedApps = ['app1', 'app2'];

describe('handleAffectedFederationServices', () => {
  beforeEach(() => {
    jest.spyOn(getAffectedApps, 'getAffectedApps').mockReturnValueOnce(affectedApps);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('1. Should call generateFederationPreview and return previewUrl', async () => {
    const expectedPreviewUrl = 'https://mocked-preview-url';

    jest.spyOn(generateFederationPreview, 'generateFederationPreview').mockResolvedValue(expectedPreviewUrl);

    const result = await previewActionUtils.handleAffectedFederationServices(affectedApps);

    expect(result).toEqual(expectedPreviewUrl);
    expect(generateFederationPreview.generateFederationPreview).toHaveBeenCalledWith(affectedApps);
  });
});

describe('handleAffectedFederationProjects', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('1. Should call getAffectedFederationProjects and generateFederationProjectsPreview', () => {
    const federationPreviewUrl = 'https://mocked-preview-url';
    jest.spyOn(federationUtils, 'getAffectedFederationProjects').mockReturnValueOnce([{ name: 'test', path: 'test/path' }]);
    jest.spyOn(generateFederationProjectsPreview, 'generateFederationProjectsPreview').mockImplementation();

    previewActionUtils.handleAffectedFederationProjects(affectedApps, federationPreviewUrl);

    expect(federationUtils.getAffectedFederationProjects).toHaveBeenCalledWith(affectedApps);
    expect(generateFederationProjectsPreview.generateFederationProjectsPreview).toHaveBeenCalledWith([{ name: 'test', path: 'test/path' }], federationPreviewUrl);
  });

  it('2. Should handle errors and log them when handleAffectedFederationProjects function fails', async () => {
    const affectedApps = ['app1', 'app2'];
    const federationPreviewUrl = 'https://mocked-preview-url';
    const errorMock = new Error('Mocked error message');

    jest.spyOn(federationUtils, 'getAffectedFederationProjects').mockReturnValueOnce([{ name: 'test', path: 'test/path' }]);
    jest.spyOn(generateFederationProjectsPreview, 'generateFederationProjectsPreview').mockRejectedValueOnce(errorMock);

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    await expect(previewActionUtils.handleAffectedFederationProjects(affectedApps, federationPreviewUrl)).rejects.toThrowError(`Failed to handle affected federation projects: ${errorMock.stack}`);

    expect(federationUtils.getAffectedFederationProjects).toHaveBeenCalledWith(affectedApps);
    expect(generateFederationProjectsPreview.generateFederationProjectsPreview).toHaveBeenCalledWith([{ name: 'test', path: 'test/path' }], federationPreviewUrl);
    expect(consoleErrorMock).toHaveBeenCalledWith('Error handling affected federation projects:', errorMock);

    consoleErrorMock.mockRestore();
  });
});

describe('handleOtherProjects', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('1. Should call generatePreviewLink for other apps', () => {
    jest.spyOn(federationUtils, 'getAffectedFederationProjects').mockReturnValueOnce([{ name: 'test', path: 'test/path' }]);
    jest.spyOn(federationUtils, 'getAffectedFederationServices').mockReturnValueOnce(['test']);
    jest.spyOn(deployProject, 'deployProject').mockResolvedValueOnce('https://mocked-preview-link');

    previewActionUtils.handleOtherProjects(affectedApps);

    expect(deployProject.deployProject).toHaveBeenCalledWith({ app: 'app1', deploymentCommand: 'preview' });
  });
  it('2. Should log failure when handleOtherProjects function fails', async () => {
    const affectedApps = ['app1', 'app2'];
    const errorMock = new Error('Mocked error message');
    jest.spyOn(federationUtils, 'getAffectedFederationProjects').mockImplementationOnce(() => {
      throw errorMock;
    });
    jest.spyOn(federationUtils, 'getAffectedFederationServices').mockReturnValueOnce(['test']);
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    await expect(previewActionUtils.handleOtherProjects(affectedApps)).rejects.toThrowError(`Failed to handle other projects: ${errorMock.stack}`);

    expect(consoleErrorMock).toHaveBeenCalledWith('Error handling other projects:', errorMock);
    consoleErrorMock.mockRestore();
  });
});
