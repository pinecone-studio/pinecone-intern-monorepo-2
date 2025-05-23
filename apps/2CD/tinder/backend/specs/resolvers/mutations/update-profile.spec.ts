import User from 'src/models/user';
import { updateProfile } from 'src/resolvers/mutations/update-profile';

jest.mock('src/models/user', () => ({
  findByIdAndUpdate: jest.fn()
}));

describe('updateProfile', () => {
  const mockUser = {
    _id: 'user123',
    name: 'John Doe',
    bio: 'Hello!',
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the user profile', async () => {
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);

    const args = {
      input: {
        name: 'John Doe',
        bio: 'Updated Bio',
      },
    };

    const context = {
      userId: 'user123',
    };

    const result = await updateProfile({}, args, context);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      'user123',
      {
        name: 'John Doe',
        bio: 'Updated Bio',
      },
      { new: true }
    );

    expect(result).toEqual(mockUser);
  });

  it('should throw if not authenticated', async () => {
    const args = {
      input: {
        name: 'John Doe',
      },
    };

    await expect(
      updateProfile({}, args, { userId: null })
    ).rejects.toThrow('Unauthorized');
  });
});