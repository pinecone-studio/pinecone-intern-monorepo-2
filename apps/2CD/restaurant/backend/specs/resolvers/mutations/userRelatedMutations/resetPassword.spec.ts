import { resetPassword } from 'src/resolvers/mutations';
import { findUserByEmail } from 'src/resolvers/mutations/userRelatedMutations/user-helpers';
import { User } from 'src/models/user.model';
import bcrypt from 'bcryptjs';

jest.mock('src/resolvers/mutations/userRelatedMutations/user-helpers', () => ({
  findUserByEmail: jest.fn(),
}));
jest.mock('src/models/user.model', () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
  },
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('resetPassword', () => {
  const input = {
    email: 'test@gmail.com',
    newPassword: 'newPass',
  };

  it('should throw if user is not found', async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(resetPassword(undefined, { input })).rejects.toThrow('User not found');
    expect(findUserByEmail).toHaveBeenCalledWith('test@gmail.com');
  });

  it('should hash the new password and update it in DB', async () => {
    const mockUser = { _id: 'user123', email: 'test@gmail.com' };
    const fakeHashedPassword = 'hashed123';

    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue(fakeHashedPassword);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    const result = await resetPassword(undefined, { input });

    expect(findUserByEmail).toHaveBeenCalledWith('test@gmail.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user123', {
      password: fakeHashedPassword,
    });
    expect(result).toEqual({
      success: true,
      message: 'Password reseted successfuly',
    });
  });
});
