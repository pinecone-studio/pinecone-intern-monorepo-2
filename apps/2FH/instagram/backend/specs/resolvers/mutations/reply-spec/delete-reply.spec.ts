import { Reply } from 'src/models';
import { deleteReply } from 'src/resolvers/mutations/reply-mutation';

jest.mock('src/models', () => ({
  Reply: { findByIdAndDelete: jest.fn(), findById: jest.fn() },
}));

describe('deleteReply resolver', () => {
  const mockUserId = 'mockedUserId';
  const mockReplyId = 'mockReplyId';

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockReply = {
    _id: mockReplyId,
    content: 'delete mock reply',
    author: { _id: mockUserId },
  };

  it('should delete reply successfully', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue(mockReply);
    (Reply.findByIdAndDelete as jest.Mock).mockResolvedValue(mockReply);

    const result = await deleteReply({}, mockReplyId, mockUserId);

    expect(Reply.findById).toHaveBeenCalledWith(mockReplyId);
    expect(Reply.findByIdAndDelete).toHaveBeenCalledWith(mockReplyId);
    expect(result).toEqual(mockReply);
  });

  it('should throw GraphQLError if _id is empty', async () => {
    await expect(deleteReply({}, '', mockUserId)).rejects.toThrow('Id is not found');
  });

  it('should throw GraphQLError if userId is missing', async () => {
    await expect(deleteReply({}, mockReplyId, '')).rejects.toThrow('auth user Id is missing');
  });
  it('should throw GraphQlError if not found deleted reply', async () => {
    (Reply.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
    await expect(deleteReply({}, mockReplyId, mockUserId)).rejects.toThrow('not found deleted reply');
  });
  it('should throw GraphQlError if not found reply', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue(null);
    await expect(deleteReply({}, mockReplyId, mockUserId)).rejects.toThrow('Reply not found');
  });
  it('should throw GraphQLError if user is not author of reply', async () => {
    const mockReply = {
      _id: mockReplyId,
      content: 'this mock is check reply author',
      author: { _id: 'anotherUserId' },
    };
    (Reply.findById as jest.Mock).mockResolvedValue(mockReply);

    await expect(deleteReply({}, mockReplyId, mockUserId)).rejects.toThrow('You are not author of this reply');
  });

  it('should catch unknown errors thrown by Reply.findByIdAndDelete (Error)', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue(mockReply);
    (Reply.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    await expect(deleteReply({}, mockReplyId, mockUserId)).rejects.toThrow('Failed to delete reply:DB error');
  });

  it('should catch unknown errors thrown by Reply.findByIdAndDelete (string)', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue(mockReply);
    (Reply.findByIdAndDelete as jest.Mock).mockImplementationOnce(() => {
      throw 'some string';
    });

    await expect(deleteReply({}, mockReplyId, mockUserId)).rejects.toThrow('Failed to delete reply:"some string"');
  });
});
