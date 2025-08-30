import { verifyEmailOTP } from 'src/resolvers/mutations/user/verify-email-otp-mutation';
import { User } from 'src/models';
import { GraphQLError } from 'graphql';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/models');
jest.mock('src/resolvers/mutations/user/forgot-password-mutation', () => ({
  otpStorage: new Map(),
}));

const mockUser = User as jest.Mocked<typeof User>;
const mockOtpStorage = otpStorage as jest.Mocked<Map<string, { otp: string; expiresAt: number }>>;

describe('verifyEmailOTP - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOtpStorage.clear();
  });

  it('should handle multiple verification attempts for same email', async () => {
    mockOtpStorage.set('verification_test@example.com', {
      otp: '123456',
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    mockUser.findOneAndUpdate.mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      isVerified: true,
    } as never);

    // First verification should succeed
    const result1 = await verifyEmailOTP(null, {
      email: 'test@example.com',
      otp: '123456',
    });
    expect(result1).toBe(true);

    // Second verification should fail (OTP already used)
    await expect(
      verifyEmailOTP(null, {
        email: 'test@example.com',
        otp: '123456',
      })
    ).rejects.toThrow(
      new GraphQLError('Verification OTP not found or expired', {
        extensions: { code: 'VERIFICATION_OTP_NOT_FOUND' },
      })
    );
  });

  it('should handle concurrent verification attempts', async () => {
    mockOtpStorage.set('verification_test@example.com', {
      otp: '123456',
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    mockUser.findOneAndUpdate.mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      isVerified: true,
    } as never);

    // Simulate concurrent attempts
    const promise1 = verifyEmailOTP(null, { email: 'test@example.com', otp: '123456' });
    const promise2 = verifyEmailOTP(null, { email: 'test@example.com', otp: '123456' });

    const results = await Promise.allSettled([promise1, promise2]);

    // At least one should succeed
    const successCount = results.filter(
      (result) => result.status === 'fulfilled' && result.value === true
    ).length;

    expect(successCount).toBeGreaterThanOrEqual(1);
  });

  it('should handle case-sensitive OTP validation', async () => {
    mockOtpStorage.set('verification_test@example.com', {
      otp: 'AbCd12',
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    mockUser.findOneAndUpdate.mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      isVerified: true,
    } as never);

    // OTP should match exactly (case-sensitive)
    await expect(
      verifyEmailOTP(null, {
        email: 'test@example.com',
        otp: 'AbCd12',
      })
    ).resolves.toBe(true);

    // Incorrect case should fail
    await expect(
      verifyEmailOTP(null, {
        email: 'test@example.com',
        otp: 'abcd12',
      })
    ).rejects.toThrow(
      new GraphQLError('Verification OTP not found or expired', {
        extensions: { code: 'VERIFICATION_OTP_NOT_FOUND' },
      })
    );
  });

  it('should call findOneAndUpdate with correct parameters', async () => {
    mockOtpStorage.set('verification_test@example.com', {
      otp: '123456',
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    mockUser.findOneAndUpdate.mockResolvedValue({
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      isVerified: true,
    } as never);

    await verifyEmailOTP(null, {
      email: 'Test@Example.COM',
      otp: '123456',
    });

    expect(mockUser.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      { isVerified: true },
      { new: true }
    );
  });
});