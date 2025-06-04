import { getAllUsers } from '../../../../src/resolvers/queries/user/get-all-users';
import User from '../../../../src/models/user';

jest.mock('../../../../src/models/user', () => ({
  find: jest.fn(),
}));

describe('getAllUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of users', async () => {
    const mockUsers = [
      { _id: '1', clerkId: 'clerk1', name: 'User One', email: 'user1@example.com' },
      { _id: '2', clerkId: 'clerk2', name: 'User Two', email: 'user2@example.com' },
    ];

    (User.find as jest.Mock).mockResolvedValue(mockUsers);

    const result = await getAllUsers();

    expect(User.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it('should throw error when DB fails', async () => {
    (User.find as jest.Mock).mockRejectedValue(new Error('DB failure'));

    await expect(getAllUsers()).rejects.toThrow('DB failure');
  });
});
