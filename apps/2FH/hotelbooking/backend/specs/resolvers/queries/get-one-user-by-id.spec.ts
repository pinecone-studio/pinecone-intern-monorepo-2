import { getUserById } from 'src/resolvers/queries/user/get-one-user-by-id';
import { UserModel } from 'src/models';
import mongoose from 'mongoose';

jest.mock('src/models', () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe('Get User by ID', () => {
  const mockFindById = UserModel.findById as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should throw error if user ID is empty', async () => {
    await expect(getUserById({}, { input: { _id: '' } })).rejects.toThrow('Please provide user ID.');
  });

  it('2. Should throw if id is not a valid ObjectId', async () => {
    const invalidId = '123-invalid-id';
    await expect(getUserById({}, { input: { _id: invalidId } })).rejects.toThrow(`Invalid user ID: ${invalidId}`);
  });

  it('3. Should not throw for a valid ObjectId', async () => {
    const validId = new mongoose.Types.ObjectId().toString();

    const mockUser = { _id: validId, email: 'test@example.com' };
    const mockSelect = jest.fn().mockResolvedValue(mockUser);

    mockFindById.mockReturnValue({ select: mockSelect });

    const result = await getUserById({}, { input: { _id: validId } });

    expect(result).toEqual(mockUser);
    expect(mockFindById).toHaveBeenCalledWith(validId);
    expect(mockSelect).toHaveBeenCalledWith('-password');
  });

  it('4. Should throw error if user is not found', async () => {
    const validId = new mongoose.Types.ObjectId().toString();

    const mockSelect = jest.fn().mockResolvedValue(null);
    mockFindById.mockReturnValue({ select: mockSelect });

    await expect(getUserById({}, { input: { _id: validId } })).rejects.toThrow(`Error fetching user: User not found with id ${validId}`);

    expect(mockFindById).toHaveBeenCalledWith(validId);
    expect(mockSelect).toHaveBeenCalledWith('-password');
  });

  it('5. Should rethrow unknown error from fetchUserById', async () => {
    const invalidId = new mongoose.Types.ObjectId().toString();
    mockFindById.mockImplementation(() => {
      throw { message: 'Unknown DB error' };
    });

    await expect(getUserById({}, { input: { _id: invalidId } })).rejects.toEqual({ message: 'Unknown DB error' });
  });
});
