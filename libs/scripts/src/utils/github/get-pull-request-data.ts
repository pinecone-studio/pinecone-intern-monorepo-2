/* eslint-disable camelcase */
import { handleApiError } from '../handle-errors/handle-api-error';
import { getGithubContext, getGithubOctokit, getPullRequestNumber } from './github-utils';
import { GithubBaseType } from './types';

type GetPullRequestDataResponseType = {
  creator: string;
  title: string;
  merger: string;
  pullRequestUrl: string;
  headSha: string;
  baseSha: string;
};

export const cachedPullRequestResponseData = new Map();

const buildPullRequestResponse = (response) => {
  return {
    creator: response.data.user.login,
    title: response.data.title,
    merger: response.data.merged_by?.login || '',
    headSha: response.data.head.sha,
    baseSha: response.data.base.sha,
  };
};

export const getPullRequestCachedData = async ({ octokit, context, pullRequestNumber }: GithubBaseType) => {
  if (cachedPullRequestResponseData.has(pullRequestNumber)) {
    return cachedPullRequestResponseData.get(pullRequestNumber);
  }

  const response = await octokit.rest.pulls.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pullRequestNumber,
  });

  const responseData: GetPullRequestDataResponseType = {
    ...buildPullRequestResponse(response),
    pullRequestUrl: `https://github.com/pinecone-studio/pinecone-intern-monorepo/pull/${pullRequestNumber}`,
  };

  cachedPullRequestResponseData.set(pullRequestNumber, responseData);

  return responseData;
};

export const getPullRequestData = async (): Promise<GetPullRequestDataResponseType> => {
  const githubOctokit = getGithubOctokit();
  const pullRequestNumber = getPullRequestNumber();
  const githubContext = getGithubContext();

  try {
    return await getPullRequestCachedData({ octokit: githubOctokit, context: githubContext, pullRequestNumber });
  } catch (error) {
    handleApiError('Error while getting pull request data', error);
  }
};
