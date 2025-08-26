import { Comment } from 'src/models';
import { updateCommentByLikes } from 'src/resolvers/mutations/comment/update-by-likes';

jest.mock('src/models', () => ({
  Comment: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateCommentByLikes resolver', () => {
const _id="updateDCommentId"
  const validLikes = ['like1'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add new likes successfully', async () => {
    const mockUpdatedComment = { _id, likes: validLikes };
    (Comment.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedComment);

    const args = { input: { likes: validLikes } };
    const result = await updateCommentByLikes({}, _id, args);

    expect(Comment.findById).toHaveBeenCalledWith(_id);
    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
      _id,
      expect.objectContaining({
        $addToSet: { likes: { $each: validLikes } },
      }),
      { new: true }
    );
    expect(result).toEqual(mockUpdatedComment);
  });

  it('should remove existing likes successfully', async () => {
    const existingLikes = ['like1', 'like2'];
    const mockUpdatedComment = { _id, likes: ['like2'] };

    (Comment.findById as jest.Mock).mockResolvedValue({ _id, likes: existingLikes });
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedComment);

    const args = { input: { likes: ['like1'] } };
    const result = await updateCommentByLikes({}, _id, args);

    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
      _id,
      expect.objectContaining({
        $pull: { likes: { $in: ['like1'] } },
      }),
      { new: true }
    );
    expect(result).toEqual(mockUpdatedComment);
  });

  it('should throw when likes array is empty', async () => {
    const args = { input: { likes: [] } };
    await expect(updateCommentByLikes({}, _id, args)).rejects.toThrow('Likes input array is empty');
  });

  it('should handle input undefined (fallback to empty object)', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id, likes: [] });
    const args = {};
    await expect(updateCommentByLikes({}, _id, args)).rejects.toThrow('Likes input array is empty');
  });

  it('should throw if _id is missing', async () => {
    const args = { input: { likes: validLikes } };
    await expect(updateCommentByLikes({}, '', args)).rejects.toThrow('Id is not found');
  });

  it('should throw if comment not found', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue(null);
    const args = { input: { likes: validLikes } };
    await expect(updateCommentByLikes({}, _id, args)).rejects.toThrow('Comment not found');
  });

  it('should throw GraphQLError when Mongoose throws a real error', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB crashed');
    });

    const args = { input: { likes: validLikes } };
    await expect(updateCommentByLikes({}, _id, args)).rejects.toThrow('Failed to update likes:DB crashed');
  });

  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

    const args = { input: { likes: validLikes } };
    await expect(updateCommentByLikes({}, _id, args)).rejects.toThrow('Failed to update likes:{"foo":"bar"}');
  });
});
