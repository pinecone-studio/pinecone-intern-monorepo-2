import { User } from 'src/models/user.model';
import { changePassword } from 'src/resolvers/mutations';
import bcrypt from 'bcryptjs';

jest.mock('src/models/user.model', () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('it should change the user password by user id', () => {
  it('should find user by id', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);
    const input = {
      currentPassword: 'oldPass123',
      newPassword: 'newPass456',
      userID: 'mock_id',
    };

    await expect(changePassword(undefined, { input })).rejects.toThrow('User not found');
    expect(User.findById).toHaveBeenCalledWith('mock_id');
  });

  it('should throw error if the user password doesnt match', async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'user123',
      password: 'currentPass',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const input = {
      userID: 'user123',
      currentPassword: 'wrongPass',
      newPassword: 'newPass',
    };
    await expect(changePassword(undefined, { input })).rejects.toThrow('Current password is wrong');
    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPass', 'currentPass');
  });
  it('should hash the new password and update in db', async () => {
    const userId = 'user123';
    const fakeHashedPassword = 'fakePassword';

    (User.findById as jest.Mock).mockResolvedValue({
      _id: userId,
      password: 'correctHashedPass',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue(fakeHashedPassword);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    const input = {
      userID: userId,
      currentPassword: 'correctPass',
      newPassword: 'newPass',
    };

    const result = await changePassword(undefined, { input });

    expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
      password: fakeHashedPassword,
    });
    expect(result).toEqual({
      success: true,
      message: 'Password changed successfully',
    });
  });
});
