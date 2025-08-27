import { Comment } from 'src/models';
import { updateCommentByLikes } from 'src/resolvers/mutations/comment/update-by-likes';

jest.mock('src/models', () => ({
  Comment: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateCommentByLikes resolver', () => {
  const _id = 'updateDCommentId';
  const validLikes = ['like1'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add new likes successfully', async () => {
    const mockUpdatedComment = { _id, likes: validLikes };
    (Comment.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedComment);

    const args = { _id, input: { likes: validLikes } };
    const result = await updateCommentByLikes({}, args);

    expect(Comment.findById).toHaveBeenCalledWith(_id);
    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(_id, { $addToSet: { likes: { $each: args.input.likes } } }, { new: true });
    expect(result).toEqual(mockUpdatedComment);
  });

  it('should remove existing likes successfully', async () => {
    const existingLikes = ['like1', 'like2'];
    const mockUpdatedComment = { _id, likes: ['like2'] };

    (Comment.findById as jest.Mock).mockResolvedValue({ _id, likes: existingLikes });
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedComment);

    const args = { _id, input: { likes: ['like1'] } };
    const result = await updateCommentByLikes({}, args);

    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
      _id,
      expect.objectContaining({
        $pull: { likes: { $in: ['like1'] } },
      }),
      { new: true }
    );
    expect(result).toEqual(mockUpdatedComment);
  });

  it('should throw if input is missing', async () => {
    const args = { _id, input: undefined };
    await expect(updateCommentByLikes({}, args as any)).rejects.toThrow('Input is missing');
  });

  it('should throw if likes is not an array', async () => {
    const args: any = { _id, input: { likes: 'not-an-array' } };
    await expect(updateCommentByLikes({}, args)).rejects.toThrow('Likes is not an array');
  });

  it('should throw if likes array is empty', async () => {
    const args = { _id, input: { likes: [] } };
    await expect(updateCommentByLikes({}, args)).rejects.toThrow('Likes array is empty');
  });

  it('should proceed if likes array has values', async () => {
    const args = { _id, input: { likes: ['user1', 'user2'] } };
    const mockUpdatedComment = { _id, likes: ['user1', 'user2'] };

    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedComment);

    const updatedComment = await Comment.findByIdAndUpdate(_id, { $push: { likes: { $each: args.input.likes } } }, { new: true });

    expect(updatedComment).toEqual(mockUpdatedComment);
  });
  it('should update comment likes successfully', async () => {
    const args = { _id, input: { likes: ['user1', 'user2'] } };
    const mockUpdatedComment = { _id, likes: ['user1', 'user2'] };

    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedComment);

    const updatedComment = await Comment.findByIdAndUpdate(_id, { $push: { likes: { $each: args.input.likes } } }, { new: true });
    expect(updatedComment).toEqual(mockUpdatedComment);
  });

  it('should throw if _id is missing', async () => {
    const args = { _id: '', input: { likes: validLikes } };
    await expect(updateCommentByLikes({}, args)).rejects.toThrow('Id is not found');
  });

  it('should throw if comment not found', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue(null);
    const args = { _id, input: { likes: validLikes } };
    await expect(updateCommentByLikes({}, args)).rejects.toThrow('Comment not found');
  });

  it('should throw GraphQLError when Mongoose throws a real error', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB crashed');
    });

    const args = { _id, input: { likes: validLikes } };
    await expect(updateCommentByLikes({}, args)).rejects.toThrow('Failed to update likes:DB crashed');
  });

  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

    const args = { _id, input: { likes: validLikes } };
    await expect(updateCommentByLikes({}, args)).rejects.toThrow('Failed to update likes:{"foo":"bar"}');
  });
});
