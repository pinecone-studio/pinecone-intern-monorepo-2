import { GraphQLResolveInfo } from 'graphql';
import { Query } from 'mongoose';
import { PostModel } from 'src/models';
import { getPost } from 'src/resolvers/queries';
jest.mock('../../../../src/models/post.model', () => ({
  PostModel: {
    findOne: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: '12',
        description: 'Post 1',
        images: ['img1'],
        lastComments: 'String',
        commentCount: 1,
        likeCount: 1,
        updatedAt: 'date',
        createdAt: 'date',
      }),
    }),
  },
}));

describe('getPost Resolver', () => {
  const postId = '675a8333e5b384d7e785cc07';
  const userId = '675ab2e15cd837b4df939a5b';
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should throw an error if user is not authorized', async () => {
    if (!getPost) {
      throw new Error('getPost is undefined');
    }

    await expect(getPost({}, { _id: postId }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should return the post if found', async () => {
    if (!getPost) {
      throw new Error('getPost is undefined');
    }

    const response = await getPost({}, { _id: postId }, { userId: userId }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '12',
      description: 'Post 1',
      images: ['img1'],
      lastComments: 'String',
      commentCount: 1,
      likeCount: 1,
      updatedAt: 'date',
      createdAt: 'date',
    });
  });

  it('should throw an error if post not found', async () => {
    if (!getPost) {
      throw new Error('getPost is undefined');
    }

    const wrongId = 'nonexistentId';

    jest.mocked(PostModel.findOne).mockReturnValueOnce({
      populate: jest.fn().mockResolvedValue(null),
      exec: jest.fn(),
    } as unknown as Query<any, any>);

    await expect(getPost({}, { _id: wrongId }, { userId: userId }, {} as GraphQLResolveInfo)).rejects.toThrow(`Post with ID ${wrongId} not found`);
  });
});
