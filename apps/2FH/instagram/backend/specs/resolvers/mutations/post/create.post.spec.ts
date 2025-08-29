import { PostModel, User } from 'src/models';
import { createPost } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  PostModel: {
    create: jest.fn(),
  },
  User: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('createPost resolver', () => {
  const mockAuthor = 'user123';
  const mockInput = { image: ['img1.jpg', 'img2.jpg'], caption: 'Test post' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw GraphQLError if author is missing', async () => {
    await expect(createPost({}, { author: '', input: mockInput })).rejects.toThrow('User not found');
  });

  it('should throw GraphQLError if image array is empty', async () => {
    await expect(createPost({}, { author: mockAuthor, input: { image: [] } })).rejects.toThrow('Images not found');
  });

  it('should create post successfully and update user posts', async () => {
    const mockPost = { _id: 'post123', ...mockInput, author: mockAuthor };
    (PostModel.create as jest.Mock).mockResolvedValue(mockPost);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    const result = await createPost({}, { author: mockAuthor, input: mockInput });

    expect(PostModel.create).toHaveBeenCalledWith({ author: mockAuthor, ...mockInput });
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockAuthor, { $push: { posts: mockPost } }, { new: true });
    expect(result).toEqual(mockPost);
  });

  it('should catch unknown errors', async () => {
    (PostModel.create as jest.Mock).mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    await expect(createPost({}, { author: mockAuthor, input: mockInput })).rejects.toThrow('Failed to create post:DB error');
  });

  it('should catch unknown non-Error thrown object', async () => {
    const weirdError = { foo: 'bar' };
    (PostModel.create as jest.Mock).mockImplementationOnce(() => {
      throw weirdError;
    });

 
    await expect(createPost({}, { author: mockAuthor, input: mockInput })).rejects.toThrow(('Failed to create post:{"foo":"bar"}'));
  });
});
