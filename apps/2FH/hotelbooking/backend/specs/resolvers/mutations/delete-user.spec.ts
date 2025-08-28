import { UserModel } from 'src/models';
import { DeleteUser, deleteUser } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  UserModel: { findByIdAndDelete: jest.fn() },
}));

describe('Delete user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw permission error when role is user', async () => {
    const input: DeleteUser = {
      _id: '123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'pass',
      dateOfBirth: '2000-01-01',
      role: 'user',
    };

    await expect(deleteUser({}, { input })).rejects.toThrow('You do not have permission to delete.');
  });

  it('should throw error if user not found', async () => {
    const input: DeleteUser = {
      _id: '123',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'pass',
      dateOfBirth: '1990-01-01',
      role: 'admin',
    };

    (UserModel.findByIdAndDelete as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(deleteUser({}, { input })).rejects.toThrow('User not found');
  });

  it('should return success message if user deleted', async () => {
    const input: DeleteUser = {
      _id: '123',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'pass',
      dateOfBirth: '1990-01-01',
      role: 'admin',
    };

    const mockDeletedUser = { ...input };

    (UserModel.findByIdAndDelete as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockDeletedUser),
    });

    const result = await deleteUser({}, { input });
    expect(result).toBe(`${mockDeletedUser} user deleted`);
  });
});
