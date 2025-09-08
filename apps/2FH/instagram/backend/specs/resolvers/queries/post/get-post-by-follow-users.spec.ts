import { GraphQLError } from 'graphql';
import { getPostsByFollowingUsers } from 'src/resolvers/queries/post/get-posts-by-follow-users';
import { PostModel, User } from 'src/models';

jest.mock('src/models', () => ({
  PostModel: { find: jest.fn() },
  User: { findById: jest.fn() },
}));

describe('getPostsByFollowingUsers', () => {
  const mockContext = { userId: 'u1' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if user not authenticated', async () => {
    await expect(getPostsByFollowingUsers({}, {}, {})).rejects.toThrow(GraphQLError);
  });

  it('should return [] if user is not found', async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null), // user = null
    });

    const result = await getPostsByFollowingUsers({}, {}, mockContext);
    expect(result).toEqual([]);
  });

  it('should return [] if followings is undefined', async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({}), // followings missing
    });

    const result = await getPostsByFollowingUsers({}, {}, mockContext);
    expect(result).toEqual([]);
  });

  it('should return [] if followings is empty', async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ followings: [] }), // empty array
    });

    const result = await getPostsByFollowingUsers({}, {}, mockContext);
    expect(result).toEqual([]);
  });

  it('should return posts when followings exist', async () => {
    const mockPosts = [{ _id: 'p1' }];

    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ followings: ['f1'] }),
    });

    const populateMock = jest.fn().mockReturnThis();
    const sortMock = jest.fn().mockReturnThis();
    const leanMock = jest.fn().mockResolvedValue(mockPosts);

    (PostModel.find as jest.Mock).mockReturnValue({
      populate: populateMock,
      sort: sortMock,
      lean: leanMock,
    });

    const result = await getPostsByFollowingUsers({}, {}, mockContext);
    expect(result).toEqual(mockPosts);
    expect(PostModel.find).toHaveBeenCalledWith({ author: { $in: ['f1'] } });
  });

  it('should throw error if PostModel.find fails', async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ followings: ['f1'] }),
    });

    (PostModel.find as jest.Mock).mockImplementation(() => {
      throw new Error('DB fail');
    });

    await expect(getPostsByFollowingUsers({}, {}, mockContext)).rejects.toThrow('Failed to fetch posts by following users: DB fail');
  });
  it('should throw error if PostModel.find fails', async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ followings: ['f1'] }),
    });

    (PostModel.find as jest.Mock).mockImplementation(() => {
      throw new Error('some string');
    });

    await expect(getPostsByFollowingUsers({}, {}, mockContext)).rejects.toThrow('Failed to fetch posts by following users: some string');
  });
  it('should throw generic message when a non-Error is thrown', async () => {
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({ followings: ['f1'] }),
    });

    (PostModel.find as jest.Mock).mockImplementation(() => {
      throw 'primitive failure';
    });

    await expect(getPostsByFollowingUsers({}, {}, mockContext)).rejects.toThrow('Failed to fetch posts by following users');
  });
});
