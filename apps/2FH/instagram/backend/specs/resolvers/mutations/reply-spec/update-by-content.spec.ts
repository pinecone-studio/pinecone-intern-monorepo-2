import {  Reply } from 'src/models';
import { updateReplyByContent } from 'src/resolvers/mutations/reply-mutation/update-by-content';


jest.mock('src/models', () => ({
  Reply: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateReplyByContent', () => {
  const _id = 'updateDReplyId';
  const content = 'Updated content';
  const userId = 'user123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a reply successfully if author matches', async () => {
    const mockReply = { _id, content: 'old content', author: userId };

    (Reply.findById as jest.Mock).mockResolvedValue(mockReply);
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockReply, content });

    const args = { input: { content } };
    const result = await updateReplyByContent({}, _id, args, userId);

    expect(Reply.findById).toHaveBeenCalledWith(_id);
    expect(Reply.findByIdAndUpdate).toHaveBeenCalledWith(_id, { content }, { new: true });
    expect(result?.content).toBe(content);
  });

  it('should throw if content is empty', async () => {
    const args = { input: { content: '' } };
    await expect(updateReplyByContent({}, _id, args, userId)).rejects.toThrow('content is empty');
  });

  it('should throw if id is missing', async () => {
    const args = { input: { content } };
    await expect(updateReplyByContent({}, '', args, userId)).rejects.toThrow('Id is not found');
  });

  it('should throw if reply not found in checkAuthor', async () => {
    (Reply.findById as jest.Mock).mockResolvedValue(null);
    const args = { input: { content } };
    await expect(updateReplyByContent({}, _id, args, userId)).rejects.toThrow('Reply not found');
  });

  it('should throw if user is not the author', async () => {
    const mockReply = { _id, content: 'old', author: 'anotherUser' };
    (Reply.findById as jest.Mock).mockResolvedValue(mockReply);

    const args = { input: { content } };
    await expect(updateReplyByContent({}, _id, args, userId)).rejects.toThrow('You are not allowed to edit this reply');
  });

  it('should throw if updated reply is null', async () => {
    const mockReply = { _id, content: 'old', author: userId };
    (Reply.findById as jest.Mock).mockResolvedValue(mockReply);
    (Reply.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const args = { input: { content } };
    await expect(updateReplyByContent({}, _id, args, userId)).rejects.toThrow('not found Updated reply');
  });

  it('should catch unknown errors thrown as real Error instance', async () => {
    const realError = new Error('Real DB failure');
    (Reply.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw realError;
    });

    const args = { input: { content } };
    await expect(updateReplyByContent({}, _id, args, userId)).rejects.toThrow('Failed to update reply by content:Real DB failure');
  });
  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (Reply.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

    const args = { input: { content } };
    await expect(updateReplyByContent({}, _id, args, userId)).rejects.toThrow('Failed to update reply by content:{"foo":"bar"}');
  });
});
