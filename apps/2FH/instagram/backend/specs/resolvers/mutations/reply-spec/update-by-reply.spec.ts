import { Reply } from 'src/models';
import { updateReplyByReply } from 'src/resolvers/mutations/reply-mutation/update-by-reply';

jest.mock('src/models', () => ({
  Reply: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateReplyByReply resolver', () => {
  const _id = 'reply123';
  const validReplies = ['reply1', 'reply2'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update reply replies successfully', async () => {
    const mockUpdatedReply = { _id, reply: validReplies };
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedReply);

    const result = await updateReplyByReply({}, _id, { input: { reply: validReplies } });

    expect(Reply.findByIdAndUpdate).toHaveBeenCalledWith(_id, { $push: { reply: { $each: validReplies } } }, { new: true });
    expect(result).toEqual(mockUpdatedReply);
  });

  it('should throw GraphQLError if _id is missing', async () => {
    await expect(updateReplyByReply({}, '', { input: { reply: validReplies } })).rejects.toThrow('Id is not found');
  });

  it('should throw when reply array is empty', async () => {
    const args = { input: { reply: [] } };
    await expect(updateReplyByReply({}, _id, args)).rejects.toThrow('Reply array is empty');
  });

  it('should throw GraphQLError if reply not found', async () => {
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(updateReplyByReply({}, _id, { input: { reply: validReplies } })).rejects.toThrow('Reply not found');
  });
  it('should throw GraphQLError when Mongoose throws a real error', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue({ _id, reply: validReplies });
    (Reply.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB crashed');
    });

    const args = { input: { reply: validReplies } };
    await expect(updateReplyByReply({}, _id, args)).rejects.toThrow('Failed to update reply by reply:DB crashed');
  });

  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (Reply.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

    const args = { input: { reply: validReplies } };
    await expect(updateReplyByReply({}, _id, args)).rejects.toThrow('Failed to update reply by reply:{"foo":"bar"}');
  });

  it('should throw GraphQLError if _id is only whitespace', async () => {
    await expect(updateReplyByReply({}, '   ', { input: { reply: validReplies } })).rejects.toThrow('Id is not found');
  });
});
