import { GraphQLResolveInfo } from 'graphql';
import { signup } from '../../../src/resolvers/mutations/signup';
import { userModel } from '../../../src/models/user.model';

// Mock the userModel
jest.mock('../../../src/models/user.model', () => ({
  userModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('signup mutation', () => {
  const mockInput = {
    email: 'test@example.com',
    password: 'password123',
    userName: 'testuser',
    fullName: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user successfully', async () => {
    // Mock findOne to return null (user doesn't exist)
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    // Mock create to return a new user
    const mockNewUser = { ...mockInput, id: '123' };
    (userModel.create as jest.Mock).mockResolvedValue(mockNewUser);

    const response = await signup!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(userModel.create).toHaveBeenCalledWith(mockInput);
    expect(response).toEqual(mockNewUser);
  });

  it('should throw error if user already exists', async () => {
    // Mock findOne to return an existing user
    (userModel.findOne as jest.Mock).mockResolvedValue({ id: '123', ...mockInput });

    await expect(signup!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('User already exists');

    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(userModel.create).not.toHaveBeenCalled();
  });

  it('should throw error if creation fails', async () => {
    // Mock findOne to return null
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    // Mock create to throw an error
    (userModel.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

    await expect(signup!({}, { input: mockInput }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Failed to signup');

    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockInput.email });
    expect(userModel.create).toHaveBeenCalledWith(mockInput);
  });
});
