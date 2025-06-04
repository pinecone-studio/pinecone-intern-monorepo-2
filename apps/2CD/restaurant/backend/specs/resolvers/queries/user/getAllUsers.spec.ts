import { User } from 'src/models/user.model';
import { getAllUser } from 'src/resolvers/queries/user/get-all-user';
jest.mock('src/models/user.model', () => ({
  User: {
    find: jest.fn(),
  },
}));

describe('get all users', () => {
  it('should return all users from database', async () => {
    const mockUsers = [
      { _id: '1', userName: 'Alice', email: 'alice@example.com' },
      { _id: '2', userName: 'Bob', email: 'bob@example.com' },
    ];

    (User.find as jest.Mock).mockResolvedValue(mockUsers);

    const result = await getAllUser(undefined);

    expect(User.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockUsers);
  });
});
