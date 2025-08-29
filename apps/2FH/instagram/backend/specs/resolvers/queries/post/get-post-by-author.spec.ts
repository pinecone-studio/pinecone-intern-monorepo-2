import { Types } from 'mongoose';
import { PostModel } from 'src/models';
import { getPostsByAuthor } from 'src/resolvers/queries/post/get-posts-by-user-id';

jest.mock('src/models', () => ({
  PostModel: {
    find: jest.fn(() => ({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn(),
    })),
  },
}));

describe('getPostsByAuthor', () => {
  const mockAuthorId = new Types.ObjectId().toString();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if author ID is missing', async () => {
    await expect(getPostsByAuthor({}, { author: '' })).rejects.toThrow('Author ID is required');
  });

  it('should throw error if author ID is invalid', async () => {
    await expect(getPostsByAuthor({}, { author: 'invalid-id' })).rejects.toThrow('Invalid author ID');
  });

  it('should throw GraphQLError if no posts found', async () => {
    (PostModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    await expect(getPostsByAuthor({}, { author: mockAuthorId })).rejects.toThrow('No posts found for the given author.');
  });

  it('should return posts successfully', async () => {
    const fakePosts = [{ _id: '1', content: 'hello', author: { _id: mockAuthorId, username: 'user' }, comments: [] }];

    (PostModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(fakePosts),
    });

    const result = await getPostsByAuthor({}, { author: mockAuthorId });
    expect(result).toEqual(fakePosts);
  });
it('should return [] if PostModel.find returns null', async () => {
  (PostModel.find as jest.Mock).mockReturnValue({
    sort: jest.fn().mockResolvedValue(null),
  });

  const result = await getPostsByAuthor({}, { author: mockAuthorId });
  expect(result).toEqual([]);
});
  it('should throw GraphQLError if query fails', async () => {
    (PostModel.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error('db error')),
    });

    await expect(getPostsByAuthor({}, { author: mockAuthorId })).rejects.toThrow('Failed to get posts by author ID: db error');
  });

  it('should throw GraphQLError on unexpected errors', async () => {
    (PostModel.find as jest.Mock).mockImplementation(() => {
      throw 'weird error';
    });

    await expect(getPostsByAuthor({}, { author: mockAuthorId })).rejects.toThrow('Failed to get posts by author ID: "weird error"');
  });
});
