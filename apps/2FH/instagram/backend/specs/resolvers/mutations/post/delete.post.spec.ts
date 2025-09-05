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
  const mockUserId = 'user-1';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw GraphQLError if _id is empty', async () => {
    await expect(deletePost({}, { _id: '' }, { userId: mockUserId })).rejects.toThrow('Id is not found');
  });

  it('should throw GraphQLError if userId is not provided', async () => {
    await expect(deletePost({}, { _id: mockId }, { userId: '' })).rejects.toThrow('author Id is required');
  });

  it('should throw GraphQLError if post not found before delete', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(deletePost({}, { _id: mockId }, { userId: mockUserId })).rejects.toThrow('Post not found');
    expect(PostModel.findById).toHaveBeenCalledWith(mockId);
    expect(PostModel.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('should throw GraphQLError if delete returns null', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue({ author: { _id: mockUserId } });
    (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    await expect(deletePost({}, { _id: mockId }, { userId: mockUserId })).rejects.toThrow('Post is not found');
    expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: mockId });
  });

  it('should throw GraphQLError if user is not the author', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue({ author: { _id: 'another-user' } });
    await expect(deletePost({}, { _id: mockId }, { userId: mockUserId })).rejects.toThrow('You are not the author of this post');
    expect(PostModel.findById).toHaveBeenCalledWith(mockId);
    expect(PostModel.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('should return the deleted post if it exists and user is author', async () => {
    const mockPost = { _id: mockId, title: 'Test Post' };
    (PostModel.findById as jest.Mock).mockResolvedValue({ author: { _id: mockUserId } });
    (PostModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockPost);

    const result = await deletePost({}, { _id: mockId }, { userId: mockUserId });
    expect(result).toEqual(mockPost);
    expect(PostModel.findById).toHaveBeenCalledWith(mockId);
    expect(PostModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: mockId });
  });

  it('should catch unknown errors thrown by PostModel.findByIdAndDelete (Error)', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue({ author: { _id: mockUserId } });
    (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB error');
    });
    await expect(deletePost({}, { _id: mockId }, { userId: mockUserId })).rejects.toThrow('Failed to delete post: DB error');
  });

  it('should catch unknown errors thrown by PostModel.findByIdAndDelete (string)', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue({ author: { _id: mockUserId } });
    (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw 'some string';
    });
    await expect(deletePost({}, { _id: mockId }, { userId: mockUserId })).rejects.toThrow('Failed to delete post: some string');
  });

  it('should catch unknown errors thrown by PostModel.findByIdAndDelete (null)', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue({ author: { _id: mockUserId } });
    (PostModel.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw null;
    });
    await expect(deletePost({}, { _id: mockId }, { userId: mockUserId })).rejects.toThrow('Failed to delete post: null');
  });
});
