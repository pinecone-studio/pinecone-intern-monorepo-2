/* eslint-disable camelcase */
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { updateComment } from '../../../src/utils/github/update-comment';
import * as handleError from '../../../src/utils/handle-errors/handle-api-error';
jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
}));

const context = {
  repo: {
    owner: 'owner',
    repo: 'repo',
  },
} as Context;

const commentBody = 'Updated Comment';

const octokitMock = {
  rest: {
    issues: {
      listComments: jest.fn(),
      updateComment: jest.fn(),
      createComment: jest.fn(),
    },
    pulls: {
      get: jest.fn(),
    },
  },
};

describe('updateComment', () => {
  const existingComment = { id: 1, body: 'Old Comment' };

  beforeEach(() => {
    (getOctokit as jest.Mock).mockReturnValue(octokitMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('1. Should update the comment and log success', async () => {
    await updateComment({ octokit: getOctokit('token'), context, existingComment, commentBody });
    expect(octokitMock.rest.issues.updateComment).toHaveBeenCalledWith({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existingComment.id,
      body: commentBody,
    });
  });

  it('2. Should handle API error and log', async () => {
    const errorMessage = 'API error during update';
    const error = new Error(errorMessage);

    octokitMock.rest.issues.updateComment.mockRejectedValue(error);
    const handleApiErrorSpy = jest.spyOn(handleError, 'handleApiError');
    handleApiErrorSpy.mockImplementation();

    await updateComment({ octokit: getOctokit('token'), context, existingComment, commentBody });
    expect(handleApiErrorSpy).toHaveBeenCalledWith('updating comment', error);
  });
});
