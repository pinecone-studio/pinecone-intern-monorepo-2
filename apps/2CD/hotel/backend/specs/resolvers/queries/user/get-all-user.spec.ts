import { getAllUsers } from 'src/resolvers/queries/user/get-all-user';
import { User } from 'src/models/user';
import mongoose from 'mongoose';

jest.mock('src/models/user');

describe('getAllUsers', () => {
  const mockUsers = [
    {
      _id: new mongoose.Types.ObjectId().toString(),
      email: 'user1@example.com',
      phoneNumber: '11111111',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: new mongoose.Types.ObjectId().toString(),
      email: 'user2@example.com',
      phoneNumber: '22222222',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    User.find = jest.fn();
  });

  it('should return all users', async () => {
    (User.find as jest.Mock).mockResolvedValue(mockUsers);

    const result = await getAllUsers();

    expect(User.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
  });

  it('should return an empty array when no users found', async () => {
    (User.find as jest.Mock).mockResolvedValue([]);

    const result = await getAllUsers();

    expect(User.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('should throw an error if User.find fails', async () => {
    (User.find as jest.Mock).mockRejectedValue(new Error('DB Error'));

    await expect(getAllUsers()).rejects.toThrow('DB Error');
  });
});