import { PostModel } from 'src/models';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { GetPostById } from 'src/resolvers/queries/post/get-post-by-id';

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
    const mockPopulate = jest.fn().mockImplementation(() => {
      return {
        populate: mockPopulate,
        then: (resolve: any) => resolve(mockPost)
      };
    });
    (PostModel.findById as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    const result = await GetPostById({}, { _id: mockPost._id.toString() });

    expect(PostModel.findById).toHaveBeenCalledWith(mockPost._id.toString());
    expect(mockPopulate).toHaveBeenCalledWith('author');
    expect(mockPopulate).toHaveBeenCalledWith('likes');
    expect(mockPopulate).toHaveBeenCalledWith('comments.likes');
    expect(result).toEqual(mockPost);
  });

  it('should throw GraphQLError if post not found', async () => {
    const mockPopulate = jest.fn().mockImplementation(() => {
      return {
        populate: mockPopulate,
        then: (resolve: any) => resolve(null)
      };
    });
    (PostModel.findById as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    await expect(GetPostById({}, { _id: new Types.ObjectId().toString() })).rejects.toThrow(GraphQLError);
  });

  it('should throw GraphQLError if invalid id', async () => {
    await expect(GetPostById({}, { _id: 'invalid-id' })).rejects.toThrow('Invalid ID');
  });

  it('should throw GraphQLError if _id is empty', async () => {
    await expect(GetPostById({}, { _id: '' })).rejects.toThrow('_id is required');
  });

  it('should throw GraphQLError on database errors', async () => {
    const mockPopulate = jest.fn().mockImplementation(() => {
      return {
        populate: mockPopulate,
        then: () => {
          throw new Error('Database connection failed');
        }
      };
    });
    (PostModel.findById as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    await expect(GetPostById({}, { _id: new Types.ObjectId().toString() })).rejects.toThrow('Failed to get post by id: Database connection failed');
  });

  it('should throw GraphQLError on string errors', async () => {
    const mockPopulate = jest.fn().mockImplementation(() => {
      return {
        populate: mockPopulate,
        then: () => {
          throw 'String error message';
        }
      };
    });
    (PostModel.findById as jest.Mock).mockReturnValue({
      populate: mockPopulate,
    });

    await expect(GetPostById({}, { _id: new Types.ObjectId().toString() })).rejects.toThrow('Failed to get post by id: String error message');
  });
});
