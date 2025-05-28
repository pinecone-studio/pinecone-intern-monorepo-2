import User from 'src/models/user';
import { getUserById } from 'src/resolvers/mutations/user/get-user-by-id';

describe('getUserById', () => {
  it('should throw if no id is provided', async () => {
    await expect(getUserById({}, { id: undefined } as any)).rejects.toThrow('Хэрэглэгийн ID сонгоно уу');
  });

  it('should return null if user not found', async () => {
    jest.spyOn(User, 'findById').mockResolvedValue(null);
    const result = await getUserById({}, { id: 'notfound' });
    expect(result).toBeNull();
  });

  it('should return the user if found', async () => {
    const mockUser = { _id: '1', name: 'User1' };
    jest.spyOn(User, 'findById').mockResolvedValue(mockUser as { [key: string]: unknown });
    const result = await getUserById({}, { id: '1' as string });
    expect(result).toEqual(mockUser);
  });
});
