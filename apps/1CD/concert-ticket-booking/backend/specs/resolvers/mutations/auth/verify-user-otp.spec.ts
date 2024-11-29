import { verifyUserEmail } from '../../../../src/resolvers/mutations/auth/verify-user-email';
import { GraphQLResolveInfo } from 'graphql';

import User from '../../../../src/models/user.model';
import { generateOtp } from '../../../../src/utils/generate-otp';
import { generateEmail } from '../../../../src/utils/generate-email';

jest.mock('../../../../src/models/user.model', () => ({
  findOneAndUpdate: jest.fn(),
}));
jest.mock('../../../../src/utils/generate-otp', () => ({
  generateOtp: jest.fn(),
}));
jest.mock('../../../../src/utils/generate-email', () => ({
  generateEmail: jest.fn(),
}));

describe('verify user email mutation', () => {
  it('should verify user email and sent otp to email ', async () => {
    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      _id: '1',
      email: 'test@gmail.com',
    });
    (generateOtp as jest.Mock).mockReturnValue('1234');
    (generateEmail as jest.Mock).mockResolvedValueOnce('accepted');

    const result = await verifyUserEmail!({}, { email: 'test@gmail.com' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      _id: '1',
      email: 'test@gmail.com',
    });
  });
  it('should throw an error if user is not found', async () => {
    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);
    try {
      await verifyUserEmail!({}, { email: 'test@email.com' }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('User not found'));
    }
  });
});
