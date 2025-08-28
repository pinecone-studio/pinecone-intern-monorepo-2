import { UserModel } from 'src/models';
import { getUserByEmail } from 'src/resolvers/queries';

jest.mock('src/models', () => ({
  UserModel: {
    findOne: jest.fn(),
  },
}));

describe('getUserByEmail', () => {
  const mockFindOne = UserModel.findOne as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should throw error if user is not found', async () => {
    mockFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(getUserByEmail({}, { input: { email: 'notfound@example.com' } })).rejects.toThrow('User not found with email notfound@example.com');
  });

  it('2. Should throw error if email is undefined', async () => {
    // @ts-expect-error: intentionally passing undefined email
    await expect(getUserByEmail({}, { input: { email: undefined } })).rejects.toThrow('Please provide a valid email');
  });
  
  

  it('3. Should return user if email exists', async () => {
    const mockUser = {
      _id: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    mockFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    const result = await getUserByEmail({}, { input: { email: '  testtest@example.com  ' } });

    expect(mockFindOne).toHaveBeenCalledWith({ email: 'testtest@example.com' });
    expect(result._id).toBe('123');
    expect(result.email).toBe('test@example.com');
  });
});
