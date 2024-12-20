import { changePassword } from '../../../../src/resolvers/mutations/auth/change-password';
import { GraphQLResolveInfo } from 'graphql';
import bcrypt from 'bcrypt';
import User from '../../../../src/models/user.model';

jest.mock('../../../../src/models/user.model', () => ({
  findById: jest.fn(),
}));
jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

describe('user change password', () => {
  it('should throw an error if user not found or incorrect password', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce(null);
    try {
      await changePassword!({}, { input: { oldPassword: 'test123', newPassword: 'test1234' } }, { userId: '2' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User not found or incorrect password'));
    }
  });

  it('should not change password if password does not match', async () => {
    (User.findById as jest.Mock).mockResolvedValueOnce({
      _id: '1',
      email: 'test@gmail.com',
      password: 'hashedPassword',
    });
    (bcrypt.compareSync as jest.Mock).mockResolvedValueOnce(false);
    try {
      await changePassword!({}, { input: { oldPassword: 'wrongPass', newPassword: 'test1234' } }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User not found or incorrect password'));
    }
  });
  it('should change password ', async () => {
    const mockUser = {
      _id: '1',
      email: 'test@gmail.com',
      password: 'hashedPassword',
      save: jest.fn().mockResolvedValueOnce({
        // Mock the save method
        _id: '1',
        email: 'test@gmail.com',
        password: 'newHashedPassword',
      }),
    };
    (User.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (bcrypt.compareSync as jest.Mock).mockResolvedValueOnce(true);

    const result = await changePassword!({}, { input: { oldPassword: 'correctPass', newPassword: 'test1234' } }, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      message: 'success',
    });
    expect(mockUser.save).toHaveBeenCalled();
  });
});
