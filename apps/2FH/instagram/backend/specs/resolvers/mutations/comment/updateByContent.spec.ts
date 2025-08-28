import { Comment } from 'src/models';
import { updateCommentByContent } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  Comment: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateCommentByContent', () => {
  const mockCommentId = '123abc';
  const mockUserId = 'user123';
  const mockInput = { content: 'Updated content' };

  afterEach(() => {
    jest.clearAllMocks();
  });
  

  it('should throw if content is empty', async () => {
    await expect(updateCommentByContent({}, { _id: mockCommentId, userId: mockUserId, input: { content: '' } })).rejects.toThrow('content is empty');
  });

  it('should throw if _id is empty', async () => {
    await expect(updateCommentByContent({}, { _id: '', userId: mockUserId, input: mockInput })).rejects.toThrow('Id is not found');
  });

  it('should throw if comment not found', async () => {
    (Comment.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateCommentByContent({}, { _id: mockCommentId, userId: mockUserId, input: mockInput })).rejects.toThrow('Comment not found');

    expect(Comment.findById).toHaveBeenCalledWith(mockCommentId);
  });
  it('should throw if comment not found', async () => {
    const mockComment = { _id: mockCommentId, author: mockUserId };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
    await expect(updateCommentByContent({}, { _id: mockCommentId, userId: mockUserId, input: mockInput })).rejects.toThrow('not found Updated comment');
  });
  it('should throw if user is not author', async () => {
    const mockComment = { _id: mockCommentId, author: 'someoneElse' };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);

    await expect(updateCommentByContent({}, { _id: mockCommentId, userId: mockUserId, input: mockInput })).rejects.toThrow('You are not allowed to edit this comment');
  });

  it('should update and return comment successfully', async () => {
    const mockComment = { _id: mockCommentId, author: mockUserId };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: mockCommentId, author: mockUserId, content: mockInput.content });

    const result = await updateCommentByContent({}, { _id: mockCommentId, userId: mockUserId, input: mockInput });

    expect(result).toEqual({ _id: mockCommentId, author: mockUserId, content: mockInput.content });
    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(mockCommentId, { content: mockInput.content }, { new: true });
  });

  it('should catch unknown errors', async () => {
    (Comment.findById as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    await expect(updateCommentByContent({}, { _id: mockCommentId, userId: mockUserId, input: mockInput })).rejects.toThrow('Failed to update comment by content:DB error');
  });
  it('should catch unknown errors (string)', async () => {
    (Comment.findById as jest.Mock).mockImplementationOnce(() => {
      throw 'some string';
    });

    await expect(updateCommentByContent({}, { _id: mockCommentId, userId: mockUserId, input: mockInput })).rejects.toThrow('Failed to update comment by content:"some string"');
  });
});
