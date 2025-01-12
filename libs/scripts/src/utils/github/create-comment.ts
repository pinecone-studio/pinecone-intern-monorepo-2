/* eslint-disable camelcase */
import { handleApiError } from '../handle-errors/handle-api-error';
import { logger } from '../handle-errors/logger';
import { GithubCommentType } from './types';

export const createComment = async ({ octokit, context, pullRequestNumber, commentBody }: GithubCommentType) => {
  try {
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequestNumber,
      body: commentBody,
    });
    logger.info('Comment added to the pull request.');
  } catch (error) {
    handleApiError('Error while creating comment', error);
  }
};
