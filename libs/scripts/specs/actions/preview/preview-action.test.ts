/* eslint-disable no-secrets/no-secrets */
import * as previewAction from '../../../src/actions/preview/preview-action';
import * as getAffectedApps from '../../../src/utils/affected/get-affected-apps';
import '@testing-library/jest-dom';

jest.mock('../../../src/utils/deploy-project', () => ({
  deployProject: jest.fn(),
}));

jest.mock('../../../src/utils/federation/federation-services-action-utils', () => ({
  generateFederationPreview: jest.fn(),
}));

jest.mock('../../../src/utils/actions/run-e2e-against-preview-link', () => ({
  runE2EActionAgainstPreviewLink: jest.fn(),
}));

jest.mock('../../../src/utils/github/add-comment-to-pull-request.ts', () => ({
  addCommentToPullRequest: jest.fn(),
}));

jest.mock('../../../src/utils/actions/clean-generated-preview-env-files.ts', () => ({
  cleanGeneratedPreviewEnvFiles: jest.fn(),
}));

const projectWithData = {
  name: 'Sample Project',
  url: 'https://example.com',
};
const affectedApps = ['app1', 'app2'];

describe('runGeneratePreviewAction', () => {
  beforeEach(() => {
    jest.spyOn(getAffectedApps, 'getAffectedApps').mockReturnValueOnce(affectedApps);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('1. Should build the preview URL with affected federation services', () => {
    const federationPreviewUrl = 'https://example.com/preview';
    const affectedFederationServices = ['service1', 'service2'];

    const result = previewAction.buildFederationPreviewUrl(federationPreviewUrl, affectedFederationServices);

    expect(result).toEqual({
      name: `federation with ( ${JSON.stringify(affectedFederationServices)} )`,
      url: federationPreviewUrl,
    });
  });

  it('2. Should return true if either federationProjectsPreviewUrl or otherProjectsPreviewLinks has length greater than 0', () => {
    const result1 = previewAction.areProjectsPreviewLinksAvailable([projectWithData], []);
    const result2 = previewAction.areProjectsPreviewLinksAvailable([], []);

    expect(result1).toBe(true);
    expect(result2).toBe(false);
  });

  it('3. Should return false if both federationProjectsPreviewUrl and otherProjectsPreviewLinks are empty', () => {
    const result = previewAction.areProjectsPreviewLinksAvailable([], []);
    expect(result).toBe(false);
  });

  it('9. Should add a comment if the preview URL is available', async () => {
    const mockIsActionPreviewUrlAvailable = jest.spyOn(previewAction, 'isActionPreviewUrlAvailable');
    mockIsActionPreviewUrlAvailable.mockReturnValueOnce(true);

    const previewUrl = 'https://example.com/preview';
    const affectedFederationServices = ['service1', 'service2'];
    const federationProjectsPreviewUrl = [{ name: 'Project1', url: 'https://example.com/project1' }];
    const otherProjectsPreviewLinks = [{ name: 'Project2', url: 'https://example.com/project2' }];

    await previewAction.addCommentIfPreviewUrlAvailable(previewUrl, federationProjectsPreviewUrl, otherProjectsPreviewLinks, affectedFederationServices);
    expect(mockIsActionPreviewUrlAvailable).toHaveBeenCalledWith(previewUrl, federationProjectsPreviewUrl, otherProjectsPreviewLinks);
  });
});

describe('Error Handling', () => {
  const mockError = new Error('Test error message');

  beforeEach(() => {
    jest.spyOn(getAffectedApps, 'getAffectedApps').mockImplementation(() => {
      throw mockError;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('1. Should log an error message and exit process', () => {
    const errorSpy = jest.spyOn(console, 'log').mockImplementation();
    const exitProcessSpy = jest.spyOn(process, 'exit').mockImplementation();

    const handleErrorMock = jest.spyOn(previewAction, 'handleError');
    previewAction.runGeneratePreviewAction();
    expect(handleErrorMock).toHaveBeenCalledWith(mockError);
    errorSpy.mockRestore();
    exitProcessSpy.mockRestore();
  });
});
