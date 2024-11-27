import { login } from '../../../../src/resolvers/mutations/auth/login';
import { GraphQLResolveInfo } from 'graphql';
import bcrypt from 'bcrypt';
import User from '../../../../src/models/user.model';

import { generateToken } from '../../../../src/utils/generate-token';

jest.mock('../../../../src/models/user.model', () => ({
  findOne: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));

jest.mock('../../../../src/utils/generate-token', () => ({
  generateToken: jest.fn(),
}));

describe('login', () => {
  it('should throw an error if user is not found', async () => {
    // Mock User.findOne to return null (user not found)
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    try {
      await login!({}, { input: { email: 'test@example.com', password: 'password123' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('not found user'));
    }
  });

  it('should throw an error if password does not match', async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValueOnce({ _id: '1', password: 'hashedPassword' });

    // Mock bcrypt.compareSync to return false (password does not match)
    (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(false);

    try {
      await login!({}, { input: { email: 'test@example.com', password: 'wrongPassword' } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('not match email or password'));
    }
  });

  it('should login successfully', async () => {
    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValueOnce({ _id: '1', password: 'hashedPassword' });

    // Mock bcrypt.compareSync to return true (password matches)
    (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);

    // Mock generateToken to return a token
    (generateToken as jest.Mock).mockReturnValue('token');

    // Call the login function
    const response = await login!({}, { input: { email: 'test@example.com', password: 'password123' } }, { userId: null }, {} as GraphQLResolveInfo);

    // Assert the response
    expect(response).toEqual({
      user: {
        _id: '1',
        password: 'hashedPassword', // include the password field if you want to test it explicitly
      },
      token: 'token',
    });
  });
});
