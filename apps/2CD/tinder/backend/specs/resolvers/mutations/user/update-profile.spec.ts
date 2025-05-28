import User from 'src/models/user';
import { updateUser } from 'src/resolvers/mutations/user/update-user';

describe('updateUser', () => {
  const mockUser = {
    _id: 'user123',
    name: 'John Doe',
    bio: 'Hello!',
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
  });

  it('should update the user profile', async () => {
    const args = {
      input: {
        name: 'John Doe',
        bio: 'Updated Bio',
      },
    };

    const context = {
      user: { _id: 'user123' },
    };

    const result = await updateUser({}, args, context);

    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should throw if not authenticated', async () => {
    const args = {
      input: {
        name: 'John Doe',
      },
    };

    await expect(
      updateUser({}, args, { user: undefined })
    ).rejects.toThrow('Not authenticated');
  });

  it('should throw if user not found', async () => {
    jest.spyOn(User, 'findById').mockResolvedValue(null);
    const args = { input: { name: 'Jane' } };
    const context = { user: { _id: 'user123' } };
    await expect(updateUser({}, args, context)).rejects.toThrow('User not found');
  });
});