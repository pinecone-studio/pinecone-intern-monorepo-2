import { UserModel } from 'src/models';
import { updateUser } from 'src/resolvers/mutations';

// Mock UserModel
jest.mock('src/models', () => ({
  UserModel: {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('updateUser', () => {
  const mockFindOne = UserModel.findOne as jest.Mock;
  const mockFindByIdAndUpdate = UserModel.findByIdAndUpdate as jest.Mock;

  const baseInput = {
    _id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'secret',
    role: 'user',
    dateOfBirth: '2000-01-01',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should throw error if _id is not provided', async () => {
    const badInput = { ...baseInput, _id: '' };

    await expect(updateUser({}, { input: badInput })).rejects.toThrow('User ID is required');
  });

  it('2. Should call validateUserExists (no error)', async () => {
    mockFindOne.mockResolvedValue(null);
    mockFindByIdAndUpdate.mockResolvedValue({
      _id: '123',
      toObject: () => ({ ...baseInput }),
    });

    const result = await updateUser({}, { input: baseInput });

    expect(mockFindOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      '123',
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'secret',
        role: 'user',
        dateOfBirth: '2000-01-01',
      },
      { new: true }
    );
    expect(result.password).toBeUndefined();
    expect(result._id).toBe('123');
  });

  it('3. Should throw error if email is not provided', async () => {
    const inputWithoutEmail = { ...baseInput, email: undefined };
    await expect(updateUser({}, { input: inputWithoutEmail })).rejects.toThrow('Please enter email');
  });

  it('4. Should throw error if email is already taken by another user', async () => {
    mockFindOne.mockResolvedValue({ _id: '456' }); // another user
    await expect(updateUser({}, { input: baseInput })).rejects.toThrow('Email is already in use by another user.');
  });

  it('5. Should throw error if user not found during update', async () => {
    mockFindOne.mockResolvedValue(null);
    mockFindByIdAndUpdate.mockResolvedValue(null);

    await expect(updateUser({}, { input: baseInput })).rejects.toThrow('User not found');
  });

  it('6. Should throw database error if findByIdAndUpdate throws', async () => {
    mockFindOne.mockResolvedValue(null);
    mockFindByIdAndUpdate.mockRejectedValue(new Error('Update database error: DB error'));

    await expect(updateUser({}, { input: baseInput })).rejects.toThrow('Update database error: DB error');
  });
});
