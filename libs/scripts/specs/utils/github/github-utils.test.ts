/* eslint-disable camelcase */
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import * as githubUtils from '../../../src/utils/github/github-utils';
import * as errorHandler from '../../../src/utils/handle-errors/log-and-throw-error';

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn().mockImplementation(),
  context: {
    payload: {
      repository: {
        owner: 'mockOwner',
        name: 'mockRepo',
      },
    },
    eventName: 'push',
    sha: 'mockSha',
  },
}));

describe('getGithubToken', () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'your_mocked_github_token';
  });

  afterEach(() => {
    delete process.env.GITHUB_TOKEN;
    jest.clearAllMocks();
  });

  it('1. Should return the GitHub token if it is defined', () => {
    const result = githubUtils.getGithubToken();
    expect(result).toEqual('your_mocked_github_token');
  });

  it('2. Should throw an error if GitHub token is undefined or falsy', () => {
    delete process.env.GITHUB_TOKEN;
    const mockErrorHandler = jest.spyOn(errorHandler, 'logAndThrowError');
    mockErrorHandler.mockImplementation();

    githubUtils.getGithubToken();

    expect(mockErrorHandler).toHaveBeenCalledTimes(1);
  });
});

describe('getGithubOctokit', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should call getGithubToken and return an Octokit instance', () => {
    const mockGetGithubToken = jest.spyOn(githubUtils, 'getGithubToken');
    mockGetGithubToken.mockReturnValue('your_mocked_github_token');

    githubUtils.getGithubOctokit();

    expect(mockGetGithubToken).toHaveBeenCalledTimes(1);
    expect(getOctokit).toBeCalledTimes(1);
  });
});

describe('getGithubContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('1. Should return the mocked github context', () => {
    const result = githubUtils.getGithubContext();

    expect(result).toEqual({
      payload: {
        repository: {
          owner: 'mockOwner',
          name: 'mockRepo',
        },
      },
      eventName: 'push',
      sha: 'mockSha',
    });
  });
});

describe('validatePullRequestNumber', () => {
  it('1. Should throw an error if pullRequestNumber is undefined', () => {
    const mockErrorHandler = jest.spyOn(errorHandler, 'logAndThrowError');
    mockErrorHandler.mockImplementation();
    githubUtils.validatePullRequestNumber(undefined);
    expect(mockErrorHandler).toHaveBeenCalledTimes(1);
  });
  it('2. Should not throw an error if pullRequestNumber is defined', () => {
    expect(() => githubUtils.validatePullRequestNumber(123)).not.toThrow();
  });
});

describe('getPullRequestNumber', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('1. Should call getGithubContext and validatePullRequestNumber with the correct arguments', () => {
    const mockGetGithubContext = jest.spyOn(githubUtils, 'getGithubContext');
    mockGetGithubContext.mockReturnValue({
      payload: {
        pull_request: {
          number: 42,
        },
      },
    } as Context);

    const mockValidatePullRequestNumber = jest.spyOn(githubUtils, 'validatePullRequestNumber');

    const result = githubUtils.getPullRequestNumber();

    expect(result).toBe(42);
    expect(mockGetGithubContext).toHaveBeenCalled();
    expect(mockValidatePullRequestNumber).toHaveBeenCalledWith(42);
  });

  it('2. Should return issue number if pull request number is not available in the context', () => {
    const mockGetGithubContext = jest.spyOn(githubUtils, 'getGithubContext');
    mockGetGithubContext.mockReturnValue({
      payload: {
        issue: {
          number: 123,
        },
      },
    } as Context);

    const mockValidatePullRequestNumber = jest.spyOn(githubUtils, 'validatePullRequestNumber');

    const result = githubUtils.getPullRequestNumber();

    expect(result).toBe(123);
    expect(mockGetGithubContext).toHaveBeenCalled();
    expect(mockValidatePullRequestNumber).toHaveBeenCalledWith(123);
  });

  it('3. Should return undefined if neither pull request nor issue number is available in the context', () => {
    const mockGetGithubContext = jest.spyOn(githubUtils, 'getGithubContext');
    mockGetGithubContext.mockReturnValue({ payload: {} } as Context);
    const mockValidatePullRequestNumber = jest.spyOn(githubUtils, 'validatePullRequestNumber');
    mockValidatePullRequestNumber.mockImplementation();

    const result = githubUtils.getPullRequestNumber();
    console.log(result);

    expect(result).toBeUndefined();
    expect(mockValidatePullRequestNumber).toHaveBeenCalledTimes(1);
  });
});
