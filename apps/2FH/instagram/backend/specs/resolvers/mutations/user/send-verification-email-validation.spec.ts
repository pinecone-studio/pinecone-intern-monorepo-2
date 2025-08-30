import { sendVerificationEmail } from 'src/resolvers/mutations/user/send-verification-email-mutation';
import { generateOTP, sendVerificationEmail as sendEmail } from 'src/utils';
import { GraphQLError } from 'graphql';

jest.mock('src/utils');
jest.mock('src/resolvers/mutations/user/forgot-password-mutation', () => ({
  otpStorage: new Map()
}));

const mockGenerateOTP = generateOTP as jest.MockedFunction<typeof generateOTP>;
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

describe('sendVerificationEmail - Input Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error for empty email', async () => {
    const input = { email: '' };

    await expect(sendVerificationEmail(null, { input })).rejects.toThrow(
      new GraphQLError('Valid email address is required', {
        extensions: { code: 'INVALID_EMAIL' }
      })
    );

    expect(mockGenerateOTP).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('should throw error for email without @ symbol', async () => {
    const input = { email: 'invalid-email' };

    await expect(sendVerificationEmail(null, { input })).rejects.toThrow(
      new GraphQLError('Valid email address is required', {
        extensions: { code: 'INVALID_EMAIL' }
      })
    );
  });

  it('should throw error for null email', async () => {
    await expect(sendVerificationEmail(null, { input: { email: null } as any })).rejects.toThrow(
      new GraphQLError('Valid email address is required', {
        extensions: { code: 'INVALID_EMAIL' }
      })
    );
  });

  it('should throw error for undefined email', async () => {
    await expect(sendVerificationEmail(null, { input: { email: undefined } as any })).rejects.toThrow(
      new GraphQLError('Valid email address is required', {
        extensions: { code: 'INVALID_EMAIL' }   
      })
    );
  });
})