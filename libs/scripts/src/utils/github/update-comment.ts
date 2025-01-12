import { handleApiError } from '../handle-errors/handle-api-error';
import { logger } from '../handle-errors/logger';
import { GithubCommentType } from './types';

/* eslint-disable camelcase */
export const updateComment = async ({ octokit, context, commentBody, existingComment }: GithubCommentType & { existingComment: { id: number } }) => {
  try {
    await octokit.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existingComment.id,
      body: commentBody,
    });
    logger.info('Comment updated in the pull request.');
  } catch (error) {
    handleApiError('updating comment', error);
  }
};
