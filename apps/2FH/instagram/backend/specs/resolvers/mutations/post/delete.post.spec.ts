import { PostModel } from 'src/models';
import { deletePost } from 'src/resolvers/mutations/post/delete-post';

jest.mock('src/models', () => ({
  PostModel: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('deletePost resolver', () => {
  const mockId = '123abc';
  const mockUserId = '245';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw GraphQLError if _id is empty', async () => {
    await expect(deletePost({}, { _id: '', userId: mockUserId })).rejects.toThrow('Id is not found');
  });

  it('should throw GraphQLError if post does not exist (checkAuthor)', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(deletePost({}, { _id: mockId, userId: mockUserId })).rejects.toThrow('Post not found');
  });
  it('should throw GraphQLError if user is not the author', async () => {
    const mockPost = { _id: mockId, title: 'Test Post', author: { _id: '999' } };
    (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);

    await expect(deletePost({}, { _id: mockId, userId: mockUserId })).rejects.toThrow('You are not the author of this post');
  });

  it('should throw GraphQLError if post does not exist (removePostById)', async () => {
    const mockPost = { _id: mockId, title: 'Test Post', author: { _id: mockUserId } };
    (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);
    (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await expect(deletePost({}, { _id: mockId, userId: mockUserId })).rejects.toThrow('Post is not found');
  });

  it('should return the deleted post if it exists', async () => {
    const mockPost = { _id: mockId, title: 'Test Post', author: { _id: mockUserId } };
    (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);
    (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockPost);

    const result = await deletePost({}, { _id: mockId, userId: mockUserId });
    expect(result).toEqual(mockPost);
    expect(PostModel.findById).toHaveBeenCalledWith(mockId);
    expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: mockId });
  });

  it('should catch unknown errors thrown by PostModel.findByIdAndDelete (Error)', async () => {
    const mockPost = { _id: mockId, title: 'Test Post', author: { _id: mockUserId } };
    (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);
    (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    await expect(deletePost({}, { _id: mockId, userId: mockUserId })).rejects.toThrow('Failed to delete post: DB error');
  });

  it('should catch unknown errors thrown by PostModel.findByIdAndDelete (string)', async () => {
    const mockPost = { _id: mockId, title: 'Test Post', author: { _id: mockUserId } };
    (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);
    (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw 'some string';
    });

    await expect(deletePost({}, { _id: mockId, userId: mockUserId })).rejects.toThrow('Failed to delete post: "some string"');
  });
});
