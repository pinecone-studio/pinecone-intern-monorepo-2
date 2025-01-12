/* eslint-disable camelcase */
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import * as getPullRequestData from '../../../src/utils/github/get-pull-request-data';
import * as handleApiError from '../../../src/utils/handle-errors/handle-api-error';

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
}));

jest.mock('../../../src/utils/github/github-utils', () => ({
  getGithubContext: jest.fn(),
  getGithubOctokit: jest.fn(),
  getPullRequestNumber: jest.fn(),
}));

jest.mock('../../../src/utils/handle-errors/handle-api-error', () => ({
  handleApiError: jest.fn(),
}));

const pullRequestNumber = 123;

const cachedData = {
  user: {
    login: 'user',
  },
  title: 'title Test',
  merged_by: {
    login: 'test merger',
  },
  issue_url: 'http',
  head: {
    sha: 'headSha',
  },
  base: { sha: 'baseSha' },
};

const responseData = {
  creator: 'user',
  title: 'title Test',
  merger: 'test merger',
  pullRequestUrl: 'https://github.com/pinecone-studio/pinecone-intern-monorepo/pull/123',
  headSha: 'headSha',
  baseSha: 'baseSha',
};

const octokitMock = {
  rest: {
    pulls: {
      get: jest.fn().mockResolvedValue({ data: cachedData }),
    },
  },
};

const context = {
  repo: {
    owner: 'owner',
    repo: 'repo',
  },
} as Context;

describe('getPullRequestCachedData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should return cached data if available', async () => {
    jest.spyOn(getPullRequestData.cachedPullRequestResponseData, 'has').mockReturnValue(true);
    jest.spyOn(getPullRequestData.cachedPullRequestResponseData, 'get').mockReturnValue(cachedData);

    const result = await getPullRequestData.getPullRequestCachedData({ octokit: getOctokit('token'), context: context, pullRequestNumber });

    expect(result).toEqual(cachedData);
    expect(octokitMock.rest.pulls.get).not.toHaveBeenCalled();
  });

  it('2. Should fetch data from GitHub API if not cached', async () => {
    const pullRequestNumber = 123;
    (getOctokit as jest.Mock).mockReturnValue(octokitMock);
    jest.spyOn(getPullRequestData.cachedPullRequestResponseData, 'has').mockReturnValue(false);

    const result = await getPullRequestData.getPullRequestCachedData({ octokit: getOctokit('token'), context: context, pullRequestNumber });

    expect(result).toEqual(responseData);
    expect(octokitMock.rest.pulls.get).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      pull_number: pullRequestNumber,
    });
  });
  it('4. Should handle merged_by as an empty string if not available', async () => {
    jest.spyOn(getPullRequestData.cachedPullRequestResponseData, 'has').mockReturnValue(false);

    const response = {
      data: {
        user: {
          login: 'user',
        },
        title: 'title Test',
        merged_by: null,
        issue_url: 'http',
        head: {
          sha: 'headSha',
        },
        base: { sha: 'baseSha' },
      },
    };

    (getOctokit as jest.Mock).mockReturnValue({
      rest: {
        pulls: {
          get: jest.fn().mockResolvedValue({ data: response.data }),
        },
      },
    });

    const result = await getPullRequestData.getPullRequestCachedData({
      octokit: getOctokit('token'),
      context,
      pullRequestNumber,
    });

    const expectedResponse = {
      creator: 'user',
      title: 'title Test',
      merger: '',
      pullRequestUrl: 'https://github.com/pinecone-studio/pinecone-intern-monorepo/pull/123',
      headSha: 'headSha',
      baseSha: 'baseSha',
    };

    expect(result).toEqual(expectedResponse);
  });
});

describe('getPullRequestData', () => {
  it('1. hould call getPullRequestCachedData and handle errors', async () => {
    jest.spyOn(getPullRequestData.cachedPullRequestResponseData, 'has').mockReturnValue(true);
    jest.spyOn(getPullRequestData.cachedPullRequestResponseData, 'get').mockReturnValue(cachedData);

    const result = await getPullRequestData.getPullRequestData();
    expect(result).toEqual(cachedData);
  });

  it('2. Should call handleApiError when there is an error', async () => {
    const error = new Error('Mocked error');
    jest.spyOn(getPullRequestData.cachedPullRequestResponseData, 'has').mockReturnValue(false);
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(handleApiError, 'handleApiError').mockImplementation();
    jest.spyOn(getPullRequestData.cachedPullRequestResponseData, 'get').mockRejectedValue(error);

    await getPullRequestData.getPullRequestData();

    expect(console.log).not.toHaveBeenCalled();
    expect(handleApiError.handleApiError).toHaveBeenCalledTimes(1);

    jest.spyOn(console, 'log').mockRestore();
  });
});
