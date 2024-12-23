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
  it('should verify user email and send otp to email', async () => {
    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      message: 'success',
    });
    (generateOtp as jest.Mock).mockReturnValue('1234');
    (generateEmail as jest.Mock).mockResolvedValueOnce('accepted');

    const result = await verifyUserEmail!({}, { email: 'test@gmail.com' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual({
      message: 'success',
    });
  });

  it('should throw an error if user is not found', async () => {
    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

    try {
      await verifyUserEmail!({}, { email: 'test@email.com' }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error: any) {
      expect(error.message).toEqual('Failed to verify user email');
    }
  });

  it('should handle internal errors and throw generic message', async () => {
    // Mock a failing `generateEmail` function
    (User.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      otp: '1234',
    });
    (generateOtp as jest.Mock).mockReturnValue('1234');
    (generateEmail as jest.Mock).mockRejectedValueOnce(new Error('Email generation failed'));

    try {
      await verifyUserEmail!({}, { email: 'test@email.com' }, { userId: '1' }, {} as GraphQLResolveInfo);
    } catch (error: any) {
      expect(error.message).toEqual('Failed to verify user email');
    }
  });
});
