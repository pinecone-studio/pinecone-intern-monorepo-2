import { PostModel } from 'src/models';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { GetPostById } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  PostModel: {
    findById: jest.fn(),
  },
}));

describe('GetPostById', () => {
  const mockPost = { _id: new Types.ObjectId(), title: 'Test Post' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a post when found', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue(mockPost);

    const result = await GetPostById({}, { _id: mockPost._id.toString() });

    expect(PostModel.findById).toHaveBeenCalledWith(mockPost._id.toString());
    expect(result).toEqual(mockPost);
  });

  it('should throw GraphQLError if post not found', async () => {
    (PostModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(GetPostById({}, { _id: new Types.ObjectId().toString() })).rejects.toThrow(GraphQLError);
  });

  it('should throw GraphQLError if invalid id', async () => {
    await expect(GetPostById({}, { _id: 'invalid-id' })).rejects.toThrow('Invalid ID');
  });

  it('should throw GraphQLError on unexpected errors', async () => {
    (PostModel.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

    await expect(GetPostById({}, { _id: new Types.ObjectId().toString() })).rejects.toThrow('Failed to get post by id: DB error');
  });
  it('should throw GraphQLError on unexpected errors', async () => {
    (PostModel.findById as jest.Mock).mockImplementationOnce(() => {
      throw 'some string';
    });

    await expect(GetPostById({}, { _id: new Types.ObjectId().toString() })).rejects.toThrow('Failed to get post by id: some string');
  });

  it('should throw GraphQLError if _id is empty', async () => {
    await expect(GetPostById({}, { _id: '' })).rejects.toThrow('_id is reqiured');
  });
});
