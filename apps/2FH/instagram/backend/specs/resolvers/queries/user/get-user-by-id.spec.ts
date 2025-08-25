import { getUserById } from 'src/resolvers/queries/user/get-user-by-id';
import { User } from 'src/models/user';
import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';

jest.mock('src/models/user');

const _ = undefined;

const mockUser = {
  _id: new Types.ObjectId('68ac3227d43f6914d3fbff57'),
  fullName: 'Test User',
  userName: 'testuser',
  email: 'test@example.com',
  followers: [],
  followings: [],
};

describe('getUserById', () => {
  const mockUserFindById = User.findById as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw error if user is not provided', async () => {
    await expect(getUserById(_, { _id: '' })).rejects.toThrow(new GraphQLError('User ID is required'));
  });
  it('should throw error if userId is invalid', async () => {
    await expect(getUserById(_, { _id: 'invalid' })).rejects.toThrow(new GraphQLError('Invalid User ID'));
  });

  it('should throw error if user is not found', async () => {
    const mockPopulate = jest.fn().mockReturnThis();
    mockUserFindById.mockReturnValue({
      populate: mockPopulate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    const validId = new Types.ObjectId().toString();

    await expect(getUserById(_, { _id: validId })).rejects.toThrow(new GraphQLError('User not found'));

    expect(mockUserFindById).toHaveBeenCalledWith(validId);
  });

  it('should return user if found', async () => {
    const mockPopulate2 = jest.fn().mockResolvedValue(mockUser);
    const mockPopulate1 = jest.fn().mockReturnValue({
      populate: mockPopulate2,
    });
    mockUserFindById.mockReturnValue({
      populate: mockPopulate1,
    });

    const result = await getUserById(_, { _id: mockUser._id.toString() });

    expect(result).toEqual(mockUser);
    expect(mockUserFindById).toHaveBeenCalledWith(mockUser._id.toString());
    expect(mockPopulate1).toHaveBeenCalledWith('followers', 'userName fullName profileImage isVerified');
    expect(mockPopulate2).toHaveBeenCalledWith('followings', 'userName fullName profileImage isVerified');
  });

  it('should handle database errors', async () => {
    const mockPopulate = jest.fn().mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('Database connection failed')),
    });
    mockUserFindById.mockReturnValue({
      populate: mockPopulate,
    });

    const validId = new Types.ObjectId().toString();

    await expect(getUserById(_, { _id: validId })).rejects.toThrow(new GraphQLError('Database connection failed'));
  });

  it('should validate ObjectId format correctly', async () => {
    const invalidIds = ['123', 'invalid-id', '123456789012345678901234567890'];

    for (const invalidId of invalidIds) {
      await expect(getUserById(_, { _id: invalidId })).rejects.toThrow(new GraphQLError('Invalid User ID'));
    }
  });
  it('should handle valid ObjectId that does not exist', async () => {
    const mockPopulate = jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });
    mockUserFindById.mockReturnValue({
      populate: mockPopulate,
    });

    const validButNonExistentId = new Types.ObjectId().toString();

    await expect(getUserById(_, { _id: validButNonExistentId })).rejects.toThrow(new GraphQLError('User not found'));
  });
});
