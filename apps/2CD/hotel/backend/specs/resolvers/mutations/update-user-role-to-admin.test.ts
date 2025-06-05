// import { updateUserRoleToAdmin } from '../../mutations/update-user-role-to-admin';
import { updateUserRoleToAdmin } from 'src/resolvers/mutations/update-user-role-to-admin';
import { User, UserRole } from 'src/models/user';
import { GraphQLError } from 'graphql';

// Mock Mongoose User model
jest.mock('src/models/user');

describe('updateUserRoleToAdmin', () => {
  const mockUser = {
    _id: { toString: () => 'user123' },
    email: 'user@example.com',
    role: UserRole.USER,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the user role to admin and return simplified user object', async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await updateUserRoleToAdmin({}, { userId: 'user123' });

    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(mockUser.role).toBe(UserRole.ADMIN);
    expect(mockUser.save).toHaveBeenCalled();

    expect(result).toEqual({
      _id: 'user123',
      email: 'user@example.com',
      role: UserRole.ADMIN,
    });
  });

  it('should throw a GraphQLError if user not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateUserRoleToAdmin({}, { userId: 'missingUser' }))
      .rejects
      .toThrow(new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND' }
      }));
  });
});
