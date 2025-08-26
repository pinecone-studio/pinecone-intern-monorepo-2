import { Reply } from 'src/models';
import { updateReplyByLikes } from 'src/resolvers/mutations/reply-mutation/update-by-likes';

jest.mock('src/models', () => ({
  Reply: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateReplyByLikes resolver', () => {
  const _id = 'updateDReplyId';
  const validLikes = ['like1'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add new likes successfully', async () => {
    const mockUpdatedReply = { _id, likes: validLikes };
    (Reply.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedReply);

    const args = { input: { likes: validLikes } };
    const result = await updateReplyByLikes({}, _id, args);

    expect(Reply.findById).toHaveBeenCalledWith(_id);
    expect(Reply.findByIdAndUpdate).toHaveBeenCalledWith(
      _id,
      expect.objectContaining({
        $addToSet: { likes: { $each: validLikes } },
      }),
      { new: true }
    );
    expect(result).toEqual(mockUpdatedReply);
  });

  it('should remove existing likes successfully', async () => {
    const existingLikes = ['like1', 'like2'];
    const mockUpdatedReply = { _id, likes: ['like2'] };

    (Reply.findById as jest.Mock).mockResolvedValue({ _id, likes: existingLikes });
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedReply);

    const args = { input: { likes: ['like1'] } };
    const result = await updateReplyByLikes({}, _id, args);

    expect(Reply.findByIdAndUpdate).toHaveBeenCalledWith(
      _id,
      expect.objectContaining({
        $pull: { likes: { $in: ['like1'] } },
      }),
      { new: true }
    );
    expect(result).toEqual(mockUpdatedReply);
  });

  it('should throw when likes array is empty', async () => {
    const args = { input: { likes: [] } };
    await expect(updateReplyByLikes({}, _id, args)).rejects.toThrow('Likes input array is empty');
  });

  it('should handle input undefined (fallback to empty object)', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id, likes: [] });
    const args = {};
    await expect(updateReplyByLikes({}, _id, args)).rejects.toThrow('Likes input array is empty');
  });

  it('should throw if _id is missing', async () => {
    const args = { input: { likes: validLikes } };
    await expect(updateReplyByLikes({}, '', args)).rejects.toThrow('Id is not found');
  });

  it('should throw if reply not found', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue(null);
    const args = { input: { likes: validLikes } };
    await expect(updateReplyByLikes({}, _id, args)).rejects.toThrow('Reply not found');
  });

  it('should throw GraphQLError when Mongoose throws a real error', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue({ _id, likes: [] });
    (Reply.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB crashed');
    });

    const args = { input: { likes: validLikes } };
    await expect(updateReplyByLikes({}, _id, args)).rejects.toThrow('Failed to update likes:DB crashed');
  });

  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (Reply.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

    const args = { input: { likes: validLikes } };
    await expect(updateReplyByLikes({}, _id, args)).rejects.toThrow('Failed to update likes:{"foo":"bar"}');
  });
});
