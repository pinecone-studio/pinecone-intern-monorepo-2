/* eslint-disable camelcase */
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { createComment } from '../../../src/utils/github/create-comment';
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
const pullRequestNumber = 123;

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

describe('createComment', () => {
  beforeEach(() => {
    (getOctokit as jest.Mock).mockReturnValue(octokitMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('1. Should create the comment and log success', async () => {
    await createComment({ octokit: getOctokit('token'), context, pullRequestNumber, commentBody });
    expect(octokitMock.rest.issues.createComment).toHaveBeenCalledWith({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequestNumber,
      body: commentBody,
    });
  });

  it('2. Should handle API error and log', async () => {
    const errorMessage = 'API error during creation';
    const error = new Error(errorMessage);

    octokitMock.rest.issues.createComment.mockRejectedValue(error);
    const handleApiErrorSpy = jest.spyOn(handleError, 'handleApiError');
    handleApiErrorSpy.mockImplementation();

    await createComment({ octokit: getOctokit('token'), context, pullRequestNumber, commentBody });
    expect(handleApiErrorSpy).toHaveBeenCalledWith('Error while creating comment', error);
  });
});
