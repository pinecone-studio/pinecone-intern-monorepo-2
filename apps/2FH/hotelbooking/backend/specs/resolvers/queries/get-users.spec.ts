import { getUsers } from 'src/resolvers/queries/user/get-users';
import { UserModel } from 'src/models';

jest.mock('src/models', () => ({
  UserModel: {
    find: jest.fn(),
  },
}));

describe('Get Users', () => {
  const mockFind = UserModel.find as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should return users when found', async () => {
    const mockUsers = [
      { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', dateOfBirth: '2000-01-01' },
      { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'user', dateOfBirth: '1995-05-05' },
    ];
    mockFind.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUsers),
    });

    const result = await getUsers({}, { input: {} });

    expect(result).toEqual(mockUsers);
    expect(mockFind).toHaveBeenCalledWith({});
  });

  it('2. Should filter by email', async () => {
    const mockUsers = [{ _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', dateOfBirth: '2000-01-01' }];
    mockFind.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUsers),
    });

    const result = await getUsers({}, { input: { email: 'john@example.com' } });

    expect(result).toEqual(mockUsers);
    expect(mockFind).toHaveBeenCalledWith({ email: 'john@example.com' });
  });

  it('3. Should throw error if no users found', async () => {
    mockFind.mockReturnValue({
      select: jest.fn().mockResolvedValue([]),
    });

    await expect(getUsers({}, { input: {} })).rejects.toThrow('User not found');
  });

  it('4. Should throw error if find throws', async () => {
    mockFind.mockImplementation(() => {
      throw new Error('DB error');
    });

    await expect(getUsers({}, { input: {} })).rejects.toThrow('Error fetching users: Error: DB error');
  });
});
