/* eslint-disable no-secrets/no-secrets */
/* eslint-disable camelcase */
import { handleApiError } from '../handle-errors/handle-api-error';
import { logAndThrowError } from '../handle-errors/log-and-throw-error';
import { createComment } from './create-comment';
import { getGithubContext, getGithubOctokit, getPullRequestNumber } from './github-utils';
import { GithubBaseType } from './types';
import { updateComment } from './update-comment';

type AddCommentToPullRequestType = {
  name: string;
  url: string | boolean;
};

export const getExistingComments = async ({ context, pullRequestNumber, octokit }: GithubBaseType) => {
  try {
    return await octokit.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequestNumber,
    });
  } catch (error) {
    handleApiError('while getting existing comments', error);
  }
};

export const findExistingComment = (existingComments, key: number) => {
  const keyString = key.toString();
  return existingComments.data.find((comment) => {
    const commentText = comment.body || '';
    return commentText.includes(`${keyString}`);
  });
};

export const updateOrCreateComment = async ({
  octokit,
  context,
  pullRequestNumber,
  commentBody,
  existingComment,
}: GithubBaseType & { existingComment: { id: number } | boolean; commentBody: string }) => {
  if (existingComment) {
    await updateComment({ octokit, context, existingComment: existingComment as { id: number }, commentBody });
  } else {
    await createComment({ octokit, context, pullRequestNumber, commentBody });
  }
};

export const addCommentToPullRequest = async (projects: AddCommentToPullRequestType[]) => {
  const githubOctokit = getGithubOctokit();
  const pullRequestNumber = getPullRequestNumber();
  const githubContext = getGithubContext();

  const filteredProjects = projects.filter((project) => project !== undefined).filter(({ url }) => url);

  const commentBody = filteredProjects.map(({ name, url }) => `**${name.toLocaleUpperCase()} Preview Link:** [${url}](${url})`).join('\n');
  const comment = `${pullRequestNumber}:\n${commentBody}`;

  try {
    const existingComments = await getExistingComments({ octokit: githubOctokit, context: githubContext, pullRequestNumber });
    const isCommented = findExistingComment(existingComments, pullRequestNumber);
    await updateOrCreateComment({ octokit: githubOctokit, context: githubContext, existingComment: isCommented, pullRequestNumber, commentBody: comment });
  } catch (error) {
    logAndThrowError('Error adding/updating comment to the pull request:', error);
  }
};
