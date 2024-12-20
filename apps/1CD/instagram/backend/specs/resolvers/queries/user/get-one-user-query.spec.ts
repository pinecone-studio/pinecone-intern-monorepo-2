import { GraphQLResolveInfo } from 'graphql';
import { userModel } from 'src/models';
import { getOneUser } from 'src/resolvers/queries';

jest.mock('../../../../src/models/user.model.ts');

describe('getOneUser', () => {
  const mockUserId = '12345';
  const mockUser = {
    _id: mockUserId,
    userName: 'testUser',
    fullName: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return other user data when userId is provided', async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await getOneUser!({}, { _id: '12345' }, { userId: mockUserId }, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockUser);
    expect(userModel.findById).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw an error when userId is not provided', async () => {
    await expect(getOneUser!({}, { _id: '12345' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
