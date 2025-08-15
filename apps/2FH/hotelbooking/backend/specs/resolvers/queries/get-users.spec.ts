import { UserModel } from 'src/models';
import { getUsers } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  UserModel: { find: jest.fn() },
}));

describe('Get all users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when no users found', async () => {
    (UserModel.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const result = await getUsers();
    expect(result).toEqual([]);
    expect(UserModel.find).toHaveBeenCalled();
  });

  it('should throw error when database fails', async () => {
    (UserModel.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error(`Database connection failed`)),
    });
    await expect(getUsers()).rejects.toThrow('Error fetching users: Error: Database connection failed');
  });

  it('should return users when find returns truthy value', async () => {
    const mockUsers = [
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', dateOfBirth: '2000-01-01', password: null },
      { firstName: 'TestJohn', lastName: 'TestDoe', email: 'Testjohn@example.com', role: 'user', dateOfBirth: '2000-02-02', password: null },
    ];

    (UserModel.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockImplementation(() => mockUsers.map((user) => ({ ...user, password: null }))),
    });

    const result = await getUsers();

    await expect(result).toEqual(mockUsers);
    expect(UserModel.find).toHaveBeenCalledWith({});
  });
});
