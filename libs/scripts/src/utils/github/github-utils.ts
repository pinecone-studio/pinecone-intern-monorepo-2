import * as github from '@actions/github';
import { logAndThrowError } from '../handle-errors/log-and-throw-error';

export const getGithubToken = () => {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    logAndThrowError('GitHub token is undefined or falsy.');
  }
  return githubToken;
};

export const getGithubOctokit = () => {
  const token = getGithubToken();
  const octokit = github.getOctokit(token);
  return octokit;
};

export const getGithubContext = () => {
  const context = github.context;
  return context;
};

export const validatePullRequestNumber = (pullRequestNumber: number | undefined) => {
  if (!pullRequestNumber) {
    logAndThrowError('Pull request number is undefined or falsy.');
  }
};

export const getPullRequestNumber = () => {
  const context = getGithubContext();
  const pullRequestNumber = context.payload.pull_request?.number || context.payload.issue?.number;

  validatePullRequestNumber(pullRequestNumber);

  return pullRequestNumber;
};
