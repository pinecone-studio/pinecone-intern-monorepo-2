import { GraphQLResolveInfo } from 'graphql';
import { userModel } from 'src/models';
import { getUser } from 'src/resolvers/queries';

jest.mock('../../../../src/models/user.model.ts');

describe('getUser', () => {
  const mockUserId = '12345';
  const mockUser = {
    _id: mockUserId,
    userName: 'testUser',
    fullName: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data when userId is provided', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUser!({}, {}, { userId: mockUserId }, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockUser);
    expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw an error when userId is not provided', async () => {
    await expect(getUser!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
