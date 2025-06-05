import { getUserById } from 'src/resolvers/queries/user/get-user-by-id';
import { User } from 'src/models/user';
import mongoose from 'mongoose';

jest.mock('src/models/user');

describe('getUserById', () => {
  const mockedUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    email: 'test@example.com',
    phoneNumber: '99119911',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when valid ID is provided', async () => {
    (User.findById as jest.Mock).mockResolvedValue(mockedUser);

    const result = await getUserById(null, { id: mockedUser._id });

    expect(User.findById).toHaveBeenCalledWith(mockedUser._id);
    expect(result).toEqual(mockedUser);
  });

  it('should return null when user is not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    const result = await getUserById(null, { id: 'some-id' });

    expect(User.findById).toHaveBeenCalledWith('some-id');
    expect(result).toBeNull();
  });

  it('should handle errors and return null', async () => {
    // Silence error log during this test
    jest.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally left blank to silence error logs during test
    });

    (User.findById as jest.Mock).mockRejectedValue(new Error('DB error'));

    const result = await getUserById(null, { id: 'bad-id' });

    expect(User.findById).toHaveBeenCalledWith('bad-id');
    expect(result).toBeNull();
  });
});
