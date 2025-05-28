import User from 'src/models/user';
import { me } from 'src/resolvers/mutations/user/me';

describe('me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user if authenticated', async () => {
    const mockUser = { _id: 'user123' };
    jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
    const context = { user: { _id: 'user123' } };
    const result = await me({}, {}, context);
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(result).toBe(mockUser);
  });

  it('should return null if not authenticated', async () => {
    const context = { user: undefined };
    const result = await me({}, {}, context);
    expect(result).toBeNull();
  });
});
