import { me } from '../../../../src/resolvers/queries/user/me';
import User from '../../../../src/models/user';

jest.mock('../../../../src/models/user', () => ({
  findOne: jest.fn(),
}));

describe('me resolver', () => {
  const mockUser = {
    _id: 'user123',
    clerkId: 'clerk_abc123',
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user when found by clerkId', async () => {
    // Mock chain: findOne().select() resolves mockUser
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const result = await me({}, { clerkId: 'clerk_abc123' });

    expect(User.findOne).toHaveBeenCalledWith({ clerkId: 'clerk_abc123' });
    expect(result).toEqual(mockUser);
  });

  it('should throw error if user is not found', async () => {
    // Mock chain returns null to simulate no user found
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(me({}, { clerkId: 'non_existing_id' })).rejects.toThrow('User not found');
  });
});
