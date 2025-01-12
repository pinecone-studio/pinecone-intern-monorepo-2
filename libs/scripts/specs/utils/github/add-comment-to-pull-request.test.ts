/* eslint-disable max-lines */
/* eslint-disable camelcase */
import { getOctokit } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import * as addCommentToPullRequest from '../../../src/utils/github/add-comment-to-pull-request';
import * as createComment from '../../../src/utils/github/create-comment';
import * as getPullRequestData from '../../../src/utils/github/get-pull-request-data';
import * as githubUtils from '../../../src/utils/github/github-utils';
import * as updateComment from '../../../src/utils/github/update-comment';
import * as handleError from '../../../src/utils/handle-errors/handle-api-error';
import * as logAndThrowError from '../../../src/utils/handle-errors/log-and-throw-error';

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(),
}));

const octokitMock = {
  rest: {
    issues: {
      listComments: jest.fn(),
      updateComment: jest.fn(),
      createComment: jest.fn(),
    },
  },
};

const context = {
  repo: {
    owner: 'owner',
    repo: 'repo',
  },
} as Context;

const commentBody = 'Updated Comment';
const pullRequestNumber = 123;

const existingComments = {
  data: [{ id: 1 }, { id: 2, body: 'This is comment 2 with key 42' }, { id: 3, body: 'This is comment 3' }],
};

describe('findExistingComment', () => {
  it('1. Should find an existing comment when the key is present in the comment body', () => {
    const key = 42;

    const result = addCommentToPullRequest.findExistingComment(existingComments, key);
    expect(result).toEqual({ id: 2, body: 'This is comment 2 with key 42' });
  });
});
describe('getExistingComments', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('1. Should return existing comments', async () => {
    (getOctokit as jest.Mock).mockReturnValue(octokitMock);
    octokitMock.rest.issues.listComments.mockResolvedValue({
      data: [
        { id: 1, body: 'Comment 1' },
        { id: 2, body: 'Comment 2' },
      ],
    });

    const result = await addCommentToPullRequest.getExistingComments({ octokit: getOctokit('token'), context, pullRequestNumber });
    expect(result?.data).toEqual([
      { id: 1, body: 'Comment 1' },
      { id: 2, body: 'Comment 2' },
    ]);
  });
  it('2. Should handle API error', async () => {
    (getOctokit as jest.Mock).mockReturnValue(octokitMock);
    const handleApiErrorSpy = jest.spyOn(handleError, 'handleApiError');
    octokitMock.rest.issues.listComments.mockRejectedValue(new Error('API error'));
    await expect(addCommentToPullRequest.getExistingComments({ octokit: getOctokit('token'), context, pullRequestNumber })).rejects.toThrowError();
    expect(handleApiErrorSpy).toHaveBeenCalledWith('while getting existing comments', expect.any(Error));
  });
});

describe('updateOrCreateComment', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('1. Should call updateComment when updating an existing comment', async () => {
    const existingComment = { id: 1, body: 'Old Comment' };
    const mockUpdateComment = jest.spyOn(updateComment, 'updateComment');
    mockUpdateComment.mockResolvedValue();

    await addCommentToPullRequest.updateOrCreateComment({ octokit: getOctokit('token'), context, existingComment, pullRequestNumber, commentBody });
    expect(mockUpdateComment).toHaveBeenCalledWith({ octokit: getOctokit('token'), context, existingComment, commentBody });
  });

  it('2. Should call createComment when existingComment is falsy', async () => {
    const mockCreateComment = jest.spyOn(createComment, 'createComment');
    mockCreateComment.mockResolvedValue();

    await addCommentToPullRequest.updateOrCreateComment({ octokit: getOctokit('token'), context, existingComment: false, pullRequestNumber, commentBody });
    expect(mockCreateComment).toHaveBeenCalledWith({ octokit: getOctokit('token'), context, pullRequestNumber, commentBody });
  });
});

const mockPullRequestGetData = {
  data: {
    creator: 'testUser',
    title: 'test',
    merger: 'test merger',
    pullRequestUrl: 'http',
    baseSha: 'baseSha',
    headSha: 'headSha',
  },
};

describe('addCommentToPullRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should add comment to pull request', async () => {
    const mockProjects = [
      { name: 'Project1', url: 'http://project1.com' },
      { name: 'Project2', url: 'http://project2.com' },
    ];

    const getPullRequestNumberMock = jest.spyOn(githubUtils, 'getPullRequestNumber');
    const getGetGithubContextMock = jest.spyOn(githubUtils, 'getGithubContext');
    const getGetGithubOctokitMock = jest.spyOn(githubUtils, 'getGithubOctokit');
    const getExistingCommentsMock = jest.spyOn(addCommentToPullRequest, 'getExistingComments');
    const findExistingCommentMock = jest.spyOn(addCommentToPullRequest, 'findExistingComment');
    const updateOrCreateCommentMock = jest.spyOn(addCommentToPullRequest, 'updateOrCreateComment');
    const getPullRequestDataMock = jest.spyOn(getPullRequestData, 'getPullRequestData');

    getPullRequestNumberMock.mockImplementation();
    getGetGithubOctokitMock.mockImplementation();
    getGetGithubContextMock.mockImplementation();
    getExistingCommentsMock.mockResolvedValue(undefined);
    findExistingCommentMock.mockReturnValue(null);
    updateOrCreateCommentMock.mockResolvedValue();
    getPullRequestDataMock.mockResolvedValueOnce(mockPullRequestGetData.data);

    await addCommentToPullRequest.addCommentToPullRequest(mockProjects);

    expect(getPullRequestNumberMock).toHaveBeenCalled();
    expect(getExistingCommentsMock).toHaveBeenCalled();
    expect(findExistingCommentMock).toHaveBeenCalled();
    expect(updateOrCreateCommentMock).toHaveBeenCalled();
  });

  it('2. Should handle errors', async () => {
    const mockError = new Error('Mock error');

    const getPullRequestNumberMock = jest.spyOn(githubUtils, 'getPullRequestNumber');
    const getGetGithubContextMock = jest.spyOn(githubUtils, 'getGithubContext');
    const getGetGithubOctokitMock = jest.spyOn(githubUtils, 'getGithubOctokit');

    getPullRequestNumberMock.mockImplementation();
    getGetGithubOctokitMock.mockImplementation();
    getGetGithubContextMock.mockImplementation();

    const logAndThrowMock = jest.spyOn(logAndThrowError, 'logAndThrowError');
    const getExistingCommentsMock = jest.spyOn(addCommentToPullRequest, 'getExistingComments');

    logAndThrowMock.mockImplementation();
    getExistingCommentsMock.mockRejectedValue(mockError);

    await addCommentToPullRequest.addCommentToPullRequest([]);

    expect(logAndThrowMock).toHaveBeenCalledWith('Error adding/updating comment to the pull request:', mockError);
  });
});
