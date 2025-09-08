import { signupSendOtp } from 'src/resolvers/mutations/signup-send-otp-mutation';
import { User } from 'src/models';
import { OtpStore } from 'src/models/signup-otp-model';
import { sendUserVerificationLink } from 'src/utils/mail-handler';

jest.mock('src/models', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock('src/models/signup-otp-model', () => ({
  OtpStore: {
    create: jest.fn(),
  },
}));

jest.mock('src/utils/mail-handler', () => ({
  sendUserVerificationLink: jest.fn(),
}));

describe('signupSendOtp - Origin Determination', () => {
  const mockEmail = 'test@example.com';
  const mockOtp = 1234;

  beforeEach(() => {
    jest.clearAllMocks();
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpStore.create as jest.Mock).mockResolvedValue({});
  });

  it('should use nextUrl to generate origin if headers.origin is missing', async () => {
    const contextWithNextUrl = {
      req: {
        nextUrl: {
          protocol: 'https:',
          host: 'myapp.com',
        },
      },
    };

    await signupSendOtp!({}, { email: mockEmail }, contextWithNextUrl as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('https://myapp.com', mockEmail);
  });

  it('should fallback to default origin if both headers.origin and nextUrl are missing', async () => {
    const emptyContext = {
      req: {
        headers: undefined,
        nextUrl: undefined,
      },
    };

    await signupSendOtp!({}, { email: mockEmail }, emptyContext as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
  });

  it('should handle completely empty context gracefully', async () => {
    await signupSendOtp!({}, { email: mockEmail }, {} as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
  });

  it('should handle undefined context parameter', async () => {
    await signupSendOtp!({}, { email: mockEmail }, undefined as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
  });

  it('should handle null req in context', async () => {
    const nullReqContext = {
      req: null,
    };

    await signupSendOtp!({}, { email: mockEmail }, nullReqContext as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
  });

  it('should use nextUrl when headers is null but nextUrl exists', async () => {
    const contextWithNullHeaders = {
      req: {
        headers: null,
        nextUrl: {
          protocol: 'https:',
          host: 'example.com',
        },
      },
    };

    await signupSendOtp!({}, { email: mockEmail }, contextWithNullHeaders as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('https://example.com', mockEmail);
  });
});
