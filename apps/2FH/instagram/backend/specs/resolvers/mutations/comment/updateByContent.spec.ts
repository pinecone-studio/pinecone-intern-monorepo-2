import { Comment } from 'src/models';
import { updateCommentByContent } from 'src/resolvers/mutations/comment/update-by-content';

jest.mock('src/models', () => ({
  Comment: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateCommentByContent', () => {
  const _id = 'updateDCommentId';
  const content = 'Updated content';
  const userId = 'user123';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a comment successfully if author matches', async () => {
    const mockComment = { _id, content: 'old content', author: userId };

    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockComment, content });

    const args = { input: { content } };
    const result = await updateCommentByContent({}, _id, args, userId);

    expect(Comment.findById).toHaveBeenCalledWith(_id);
    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(_id, { content }, { new: true });
    expect(result?.content).toBe(content);
  });

  it('should throw if content is empty', async () => {
    const args = { input: { content: '' } };
    await expect(updateCommentByContent({}, _id, args, userId)).rejects.toThrow('content is empty');
  });

  it('should throw if id is missing', async () => {
    const args = { input: { content } };
    await expect(updateCommentByContent({}, '', args, userId)).rejects.toThrow('Id is not found');
  });

  it('should throw if comment not found in checkAuthor', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue(null);
    const args = { input: { content } };
    await expect(updateCommentByContent({}, _id, args, userId)).rejects.toThrow('Comment not found');
  });

  it('should throw if user is not the author', async () => {
    const mockComment = { _id, content: 'old', author: 'anotherUser' };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);

    const args = { input: { content } };
    await expect(updateCommentByContent({}, _id, args, userId)).rejects.toThrow('You are not allowed to edit this comment');
  });

  it('should throw if updated comment is null', async () => {
    const mockComment = { _id, content: 'old', author: userId };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const args = { input: { content } };
    await expect(updateCommentByContent({}, _id, args, userId)).rejects.toThrow('not found Updated comment');
  });

  it('should catch unknown errors thrown as real Error instance', async () => {
    const realError = new Error('Real DB failure');
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw realError;
    });

    const args = { input: { content } };
    await expect(updateCommentByContent({}, _id, args, userId)).rejects.toThrow('Failed to update comment by content:Real DB failure');
  });
  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (Comment.findByIdAndUpdate as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

    const args = { input: { content } };
    await expect(updateCommentByContent({}, _id, args, userId)).rejects.toThrow('Failed to update comment by content:{"foo":"bar"}');
  });
});
