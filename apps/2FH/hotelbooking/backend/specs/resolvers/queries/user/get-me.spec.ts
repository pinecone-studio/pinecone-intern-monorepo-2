import { getMe } from 'src/resolvers/queries/user/get-me';
import { UserModel } from 'src/models';

jest.mock('src/models', () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe('getMe', () => {
  const mockFindById = UserModel.findById as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the authenticated user', async () => {
    const mockUser = {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'user',
      dateOfBirth: '2000-01-01',
    };

    mockFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const context = { user: { _id: '1' } };

    const result = await getMe({}, {}, context as any);

    expect(result).toEqual(mockUser);
    expect(mockFindById).toHaveBeenCalledWith('1');
  });

  it('should throw error if user not authenticated', async () => {
    await expect(getMe({}, {}, {} as any)).rejects.toThrow('Not authenticated');
  });

  it('should throw error if user not found in DB', async () => {
    mockFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const context = { user: { _id: '1' } };

    await expect(getMe({}, {}, context as any)).rejects.toThrow('User not found');
  });
});
