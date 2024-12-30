import { GraphQLResolveInfo } from 'graphql';
import { PostModel } from 'src/models';
import { getUserPosts } from 'src/resolvers/queries';

jest.mock('../../../../src/models/post.model.ts', () => ({
  PostModel: {
    find: jest.fn(),
  },
}));

describe('getUserPosts', () => {
  const mockPosts = [
    { id: '1', title: 'Post 1', content: 'Content 1', user: 'user1' },
    { id: '2', title: 'Post 2', content: 'Content 2', user: 'user1' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('throws an error if userId is not provided', async () => {
    await expect(getUserPosts!({}, { user: 'user1' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  test('returns posts for the given user', async () => {
    (PostModel.find as jest.Mock).mockResolvedValue(mockPosts);

    const result = await getUserPosts!({}, { user: 'user1' }, { userId: 'user1' }, {} as GraphQLResolveInfo);

    expect(PostModel.find).toHaveBeenCalledWith({ user: 'user1' });
    expect(result).toEqual(mockPosts);
  });

  test('throws an error if no posts are found', async () => {
    (PostModel.find as jest.Mock).mockResolvedValue(null);

    await expect(getUserPosts!({}, { user: 'user1' }, { userId: 'user1' }, {} as GraphQLResolveInfo)).rejects.toThrow('User post not found');

    expect(PostModel.find).toHaveBeenCalledWith({ user: 'user1' });
  });
});
