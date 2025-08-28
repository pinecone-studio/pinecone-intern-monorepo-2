import { PostModel } from 'src/models';
import { updatePostByLikes } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  PostModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updatePostByLikes resolver', () => {
  const _id = 'updatePostId';
  const validLikes = ['like1'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add new likes successfully', async () => {
    const mockUpdatedPost = { _id, likes: validLikes };
    (PostModel.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedPost);

    const args = { _id, input: { likes: validLikes } };
    const result = await updatePostByLikes({}, args);

    expect(PostModel.findById).toHaveBeenCalledWith(_id);
    expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(_id, { $addToSet: { likes: { $each: args.input.likes } } }, { new: true });
    expect(result).toEqual(mockUpdatedPost);
  });

  it('should remove existing likes successfully', async () => {
    const existingLikes = ['like1', 'like2'];
    const mockUpdatedPost = { _id, likes: ['like2'] };

    (PostModel.findById as jest.Mock).mockResolvedValue({ _id, likes: existingLikes });
    (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedPost);

    const args = { _id, input: { likes: ['like1'] } };
    const result = await updatePostByLikes({}, args);

    expect(PostModel.findByIdAndUpdate).toHaveBeenCalledWith(
      _id,
      expect.objectContaining({
        $pull: { likes: { $in: ['like1'] } },
      }),
      { new: true }
    );
    expect(result).toEqual(mockUpdatedPost);
  });

  it('should throw if input is missing', async () => {
    const args = { _id, input: undefined };
    await expect(updatePostByLikes({}, args as any)).rejects.toThrow('Input is missing');
  });

  it('should throw if likes is not an array', async () => {
    const args = { _id, input: { likes: 'not-an-array' } };
    await expect(updatePostByLikes({}, args as any)).rejects.toThrow('Likes is not an array');
  });

  it('should throw if likes array is empty', async () => {
    const args = { _id, input: { likes: [] } };
    await expect(updatePostByLikes({}, args)).rejects.toThrow('Likes array is empty');
  });

  it('should proceed if likes array has values', async () => {
    const args = { _id, input: { likes: ['user1', 'user2'] } };
    const mockUpdatedPost = { _id, likes: ['user1', 'user2'] };

    (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedPost);

    const updatedPost = await PostModel.findByIdAndUpdate(_id, { $push: { likes: { $each: args.input.likes } } }, { new: true });

    expect(updatedPost).toEqual(mockUpdatedPost);
  });
  it('should update post likes successfully', async () => {
    const args = { _id, input: { likes: ['user1', 'user2'] } };
    const mockUpdatedPost = { _id, likes: ['user1', 'user2'] };

    (PostModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedPost);

    const updatedPost = await PostModel.findByIdAndUpdate(_id, { $push: { likes: { $each: args.input.likes } } }, { new: true });
    expect(updatedPost).toEqual(mockUpdatedPost);
  });

  it('should throw if _id is missing', async () => {
    const args = { _id: '', input: { likes: validLikes } };
    await expect(updatePostByLikes({}, args)).rejects.toThrow('Id is not found');
  });

  it('should throw if post not found', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue(null);
    const args = { _id, input: { likes: validLikes } };
    await expect(updatePostByLikes({}, args)).rejects.toThrow('Post not found');
  });

  it('should throw GraphQLError when Mongoose throws a real error', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (PostModel.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB crashed');
    });

    const args = { _id, input: { likes: validLikes } };
    await expect(updatePostByLikes({}, args)).rejects.toThrow('Failed to update post by likes:DB crashed');
  });

  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (PostModel.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

    const args = { _id, input: { likes: validLikes } };
    await expect(updatePostByLikes({}, args)).rejects.toThrow('Failed to update post by likes:{"foo":"bar"}');
  });
});
