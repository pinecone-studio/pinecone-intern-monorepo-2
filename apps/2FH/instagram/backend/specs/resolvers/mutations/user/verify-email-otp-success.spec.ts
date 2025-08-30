import { verifyEmailOTP } from 'src/resolvers/mutations/user/verify-email-otp-mutation';
import { User } from 'src/models';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/models');
jest.mock('src/resolvers/mutations/user/forgot-password-mutation', () => ({
  otpStorage: new Map()
}));

const mockUser = User as jest.Mocked<typeof User>;
const mockOtpStorage = otpStorage as jest.Mocked<Map<string, { otp: string; expiresAt: number }>>;

describe('verifyEmailOTP - Success Cases', () => {
  const validEmail = 'test@example.com';
  const validOTP = '123456';
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    jest.clearAllMocks();
    mockOtpStorage.clear();
    
    // Set up valid OTP in storage
    mockOtpStorage.set('verification_test@example.com', {
      otp: validOTP,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes from now
    });

    // Mock successful user update
    mockUser.findOneAndUpdate.mockResolvedValue({
      _id: mockUserId,
      email: validEmail,
      isVerified: true
    } as never);
  });

  it('should verify email OTP successfully', async () => {
    const result = await verifyEmailOTP(null, { 
      email: validEmail, 
      otp: validOTP 
    });

    expect(result).toBe(true);
    expect(mockUser.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      { isVerified: true },
      { new: true }
    );
    expect(mockOtpStorage.has('verification_test@example.com')).toBe(false);
  });

  it('should handle email with mixed case and whitespace', async () => {
    const emailWithWhitespace = '  Test@Example.COM  ';
    mockOtpStorage.set('verification_test@example.com', {
      otp: validOTP,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    const result = await verifyEmailOTP(null, { 
      email: emailWithWhitespace, 
      otp: validOTP 
    });

    expect(result).toBe(true);
    expect(mockUser.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'test@example.com' },
      { isVerified: true },
      { new: true }
    );
  });

  it('should delete OTP from storage after successful verification', async () => {
    expect(mockOtpStorage.has('verification_test@example.com')).toBe(true);

    await verifyEmailOTP(null, { 
      email: validEmail, 
      otp: validOTP 
    });

    expect(mockOtpStorage.has('verification_test@example.com')).toBe(false);
  });
})