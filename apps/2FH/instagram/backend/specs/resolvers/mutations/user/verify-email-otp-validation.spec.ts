import { verifyEmailOTP } from 'src/resolvers/mutations/user/verify-email-otp-mutation';
import { GraphQLError } from 'graphql';
import { otpStorage } from 'src/resolvers/mutations/user/forgot-password-mutation';

jest.mock('src/models');
jest.mock('src/resolvers/mutations/user/forgot-password-mutation', () => ({
  otpStorage: new Map()
}));

const mockOtpStorage = otpStorage as jest.Mocked<Map<string, { otp: string; expiresAt: number }>>;

describe('verifyEmailOTP - Input Validation', () => {
  const validOTP = '123456';

  beforeEach(() => {
    jest.clearAllMocks();
    mockOtpStorage.clear();
    mockOtpStorage.set('verification_test@example.com', {
      otp: validOTP,
      expiresAt: Date.now() + 5 * 60 * 1000
    });
  });

  it('should throw error for empty email', async () => {
    await expect(verifyEmailOTP(null, { 
      email: '', 
      otp: validOTP 
    })).rejects.toThrow(
      new GraphQLError('Valid email address is required', {
        extensions: { code: 'INVALID_EMAIL' }
      })
    );
  });

  it('should throw error for email without @ symbol', async () => {
    await expect(verifyEmailOTP(null, { 
      email: 'invalid-email', 
      otp: validOTP 
    })).rejects.toThrow(
      new GraphQLError('Valid email address is required', {
        extensions: { code: 'INVALID_EMAIL' }
      })
    );
  });

  it('should throw error for null email', async () => {
    await expect(verifyEmailOTP(null, { 
      email: null as any, 
      otp: validOTP 
    })).rejects.toThrow(
      new GraphQLError('Valid email address is required', {
        extensions: { code: 'INVALID_EMAIL' }
      })
    );
  });

  it('should throw error for empty OTP', async () => {
    await expect(verifyEmailOTP(null, { 
      email: 'test@example.com', 
      otp: '' 
    })).rejects.toThrow(
      new GraphQLError('Valid 6-digit OTP is required', {
        extensions: { code: 'INVALID_OTP_FORMAT' }
      })
    );
  });

  it('should throw error for OTP with wrong length', async () => {
    await expect(verifyEmailOTP(null, { 
      email: 'test@example.com', 
      otp: '12345' 
    })).rejects.toThrow(
      new GraphQLError('Valid 6-digit OTP is required', {
        extensions: { code: 'INVALID_OTP_FORMAT' }
      })
    );

    await expect(verifyEmailOTP(null, { 
      email: 'test@example.com', 
      otp: '1234567' 
    })).rejects.toThrow(
      new GraphQLError('Valid 6-digit OTP is required', {
        extensions: { code: 'INVALID_OTP_FORMAT' }
      })
    );
  });

  it('should throw error for null OTP', async () => {
    await expect(verifyEmailOTP(null, { 
      email: 'test@example.com', 
      otp: null as any 
    })).rejects.toThrow(
      new GraphQLError('Valid 6-digit OTP is required', {
        extensions: { code: 'INVALID_OTP_FORMAT' }
      })
    );
  });
})