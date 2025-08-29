import { sendVerificationEmail } from 'src/resolvers/mutations/user/send-verification-email-mutation';
import { generateOTP, sendVerificationEmail as sendEmail } from 'src/utils';
import { GraphQLError } from 'graphql';

jest.mock('src/utils');
jest.mock('src/resolvers/mutations/user/forgot-password-mutation', () => ({
  otpStorage: new Map()
}));

const mockGenerateOTP = generateOTP as jest.MockedFunction<typeof generateOTP>;
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

describe('sendVerificationEmail - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateOTP.mockReturnValue('123456');
  });

  it('should throw wrapped error when sendEmail fails', async () => {
    const input = { email: 'test@example.com' };
    mockSendEmail.mockRejectedValue(new Error('SMTP server error'));

    await expect(sendVerificationEmail(null, { input })).rejects.toThrow(
      new GraphQLError('Failed to send verification email', {
        extensions: { code: 'VERIFICATION_EMAIL_FAILED' }
      })
    );
  });

  it('should re-throw GraphQLErrors without wrapping', async () => {
    const input = { email: 'test@example.com' };
    const originalError = new GraphQLError('Custom email error', {
      extensions: { code: 'CUSTOM_EMAIL_ERROR' }
    });
    mockSendEmail.mockRejectedValue(originalError);

    await expect(sendVerificationEmail(null, { input })).rejects.toThrow(originalError);
  });

  it('should throw wrapped error when generateOTP fails', async () => {
    const input = { email: 'test@example.com' };
    mockGenerateOTP.mockImplementation(() => {
      throw new Error('OTP generation failed');
    });

    await expect(sendVerificationEmail(null, { input })).rejects.toThrow(
      new GraphQLError('Failed to send verification email', {
        extensions: { code: 'VERIFICATION_EMAIL_FAILED' }
      })
    );
  });

  it('should throw error when email sending fails', async () => {
    const input = { email: 'test@example.com' };
    mockSendEmail.mockRejectedValue(new Error('Email failed'));

    await expect(sendVerificationEmail(null, { input })).rejects.toThrow();

    // Verify the email function was called (testing the error path)
    expect(mockSendEmail).toHaveBeenCalled();
    expect(mockGenerateOTP).toHaveBeenCalled();
  });
})