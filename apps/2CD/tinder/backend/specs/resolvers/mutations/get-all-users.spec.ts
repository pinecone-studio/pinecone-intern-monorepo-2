import User from 'src/models/user';
import { getAllUsers } from 'src/resolvers/mutations/user/get-all-users';

describe('getAllUsers', () => {
  it('should return all users', async () => {
    const mockUsers = [
      { _id: '1', name: 'User1' },
      { _id: '2', name: 'User2' },
    ];
    jest.spyOn(User, 'find').mockResolvedValue(mockUsers as { _id: string; name: string }[]);
    const result = await getAllUsers();
    expect(User.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });
});
