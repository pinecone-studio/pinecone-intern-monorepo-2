import { Comment, Reply } from 'src/models';
import { createReply } from 'src/resolvers/mutations/reply-mutation';

jest.mock('src/models', () => ({
  Reply: {
    create: jest.fn(),
  },
  Comment: {
    findByIdAndUpdate: jest.fn(),
  },
}));
describe('createReply resolver', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const validReplyInput = {
    author: '123abc',
    commentId: '456abc',
    content: 'this reply to jest mock test',
  };

  it('should create a reply successfully', async () => {
    const mockreply = { ...validReplyInput };
    (Reply.create as jest.Mock).mockResolvedValue(mockreply);
    (Comment.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockreply);
    const result = await createReply({}, { input: validReplyInput });
    expect(Reply.create).toHaveBeenCalledWith(validReplyInput);
    expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(validReplyInput.commentId, { $push: { reply: mockreply} });
    expect(result).toEqual(mockreply);
  });
  it('should throw GraphqlError if author is missing (validateInput)', async () => {
    const inputMissingAuthor = {
      author: '',
      commentId: '456abc',
      content: 'test case to author is missing',
    };
    await expect(createReply({}, { input: inputMissingAuthor })).rejects.toThrow('User is not authenticated');
  });
  it('should throw GraphqlError if comm is missing (validateInput)', async () => {
    const inputMissingCommentId = {
      author: '123abc',
      commentId: '',
      content: 'this case to comment id is missing',
    };
    await expect(createReply({}, { input: inputMissingCommentId })).rejects.toThrow('commentId is required!');
  });
  it('should throw GraphqlError if content is empty (validateInput)', async () => {
    const inputMissingContent = {
      author: '123abc',
      commentId: '456abc',
      content: '',
    };
    await expect(createReply({}, { input: inputMissingContent })).rejects.toThrow('content is empty');
  });
  it('should catch unknown errors thrown as object', async () => {
    const unknownError = { message: 'DB error', code: 123 };
    (Reply.create as jest.Mock).mockImplementationOnce(() => {
      throw unknownError;
    });
    await expect(createReply({}, { input: validReplyInput })).rejects.toThrow('Failed to create comment:' + JSON.stringify(unknownError));
  });
  it('should catch unknown errors thrown as real Error instance', async () => {
    const realError = new Error('Real DB failure');
    (Reply.create as jest.Mock).mockImplementationOnce(() => {
      throw realError;
    });
    await expect(createReply({}, { input: validReplyInput })).rejects.toThrow('Failed to create comment:Real DB failure');
  });
});
