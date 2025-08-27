import { Comment } from 'src/models';
import { updateCommentByReply } from 'src/resolvers/mutations/comment/update-by-reply';

jest.mock('src/models', () => ({
  Comment: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateCommentByReply resolver', () => {
  const _id = 'comment123';
  const validReplies = ['reply1', 'reply2'];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update comment replies successfully', async () => {
    const mockUpdatedComment = { _id, reply: validReplies };
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedComment);

    const result = await updateCommentByReply({}, { _id, input: { reply: validReplies } });

    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
      _id,
      { $push: { replyId: { $each: validReplies } } },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedComment);
  });

  it('should throw GraphQLError if _id is missing', async () => {
    await expect(updateCommentByReply({}, { _id: '', input: { reply: validReplies } })).rejects.toThrow('Id is not found');
  });

  it('should throw when reply array is empty', async () => {
    const args = { _id, input: { reply: [] } };
    await expect(updateCommentByReply({}, args)).rejects.toThrow('Reply array is empty');
  });

  it('should throw GraphQLError if comment not found', async () => {
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    await expect(updateCommentByReply({}, { _id, input: { reply: validReplies } })).rejects.toThrow('Comment not found');
  });
  it('should throw GraphQLError when Mongoose throws a real error', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue({ _id, reply: validReplies });
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB crashed');
    });

    const args = { _id, input: { reply: validReplies } };
    await expect(updateCommentByReply({}, args)).rejects.toThrow('Failed to update comment by reply:DB crashed');
  });

  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

    const args = { _id, input: { reply: validReplies } };
    await expect(updateCommentByReply({}, args)).rejects.toThrow('Failed to update comment by reply:{"foo":"bar"}');
  });
});
