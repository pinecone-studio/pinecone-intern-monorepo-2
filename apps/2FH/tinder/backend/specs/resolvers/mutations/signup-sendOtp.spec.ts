import { signupSendOtp } from 'src/resolvers/mutations/signup-sendOtp-mutation';
import { User } from 'src/models';
import { OtpStore } from 'src/models/signupOtp-model';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
import { GraphQLError } from 'graphql';

jest.mock('src/models', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock('src/models/signupOtp-model', () => ({
  OtpStore: {
    create: jest.fn(),
  },
}));

jest.mock('src/utils/mail-handler', () => ({
  sendUserVerificationLink: jest.fn(),
}));

describe('signupSendOtp', () => {
  const mockEmail = 'test@example.com';
  const mockOtp = 1234;

  const mockContext = {
    req: {
      headers: {
        origin: 'http://localhost:3000',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if user already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: mockEmail });

    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow(GraphQLError);

    expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
    expect(sendUserVerificationLink).not.toHaveBeenCalled();
  });

  it('should generate OTP and save it when user does not exist', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpStore.create as jest.Mock).mockResolvedValue({});

    const result = await signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any);

    expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
    expect(OtpStore.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockEmail,
        otp: mockOtp,
        expiresAt: expect.any(Date),
      })
    );
    expect(result).toEqual({
      input: mockEmail,
      output: mockOtp.toString(),
    });
  });

  it('should use nextUrl to generate origin if headers.origin is missing', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpStore.create as jest.Mock).mockResolvedValue({});

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
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpStore.create as jest.Mock).mockResolvedValue({});

    const emptyContext = {
      req: {
        headers: undefined,
        nextUrl: undefined,
      },
    };

    await signupSendOtp!({}, { email: mockEmail }, emptyContext as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
  });

  // NEW TEST: Test with completely empty context to cover line 6
  it('should handle completely empty context gracefully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpStore.create as jest.Mock).mockResolvedValue({});

    await signupSendOtp!({}, { email: mockEmail }, {} as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
  });

  // NEW TEST: Test with undefined context to trigger default parameter
  it('should handle undefined context parameter', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpStore.create as jest.Mock).mockResolvedValue({});

    await signupSendOtp!({}, { email: mockEmail }, undefined as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
  });

  // NEW TEST: Test with context.req = null to cover another branch
  it('should handle null req in context', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpStore.create as jest.Mock).mockResolvedValue({});

    const nullReqContext = {
      req: null,
    };

    await signupSendOtp!({}, { email: mockEmail }, nullReqContext as any, {} as any);

    expect(sendUserVerificationLink).toHaveBeenCalledWith('http://localhost:3000', mockEmail);
  });

  // NEW TEST: Test with context.req.headers = null but nextUrl present
  it('should use nextUrl when headers is null but nextUrl exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(mockOtp);
    (OtpStore.create as jest.Mock).mockResolvedValue({});

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

  // NEW TEST: Test error without message property (line 38)
  it('should handle error without message property', async () => {
    const errorWithoutMessage = {};
    (User.findOne as jest.Mock).mockImplementation(() => {
      throw errorWithoutMessage;
    });

    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow('Something went wrong while sending OTP');
  });

  it('should rethrow GraphQLError directly', async () => {
    const graphQLError = new GraphQLError('Email already registered');
    (User.findOne as jest.Mock).mockImplementation(() => {
      throw graphQLError;
    });

    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow(GraphQLError);
  });

  it('should throw error if OTP generation fails', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(null);

    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow('Failed to generate OTP');

    expect(OtpStore.create).not.toHaveBeenCalled();
  });

  it('should rethrow GraphQLError from sendUserVerificationLink', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockImplementation(() => {
      throw new GraphQLError('Mock GraphQLError from sendUserVerificationLink');
    });

    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow(GraphQLError);
  });

  it('should handle unexpected errors gracefully', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('DB failure'));

    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow('DB failure');
  });

  it('should wrap non-GraphQLError in GraphQLError', async () => {
    const customError = new Error('Custom unexpected error');

    (User.findOne as jest.Mock).mockImplementation(() => {
      throw customError;
    });

    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow(GraphQLError);
    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow('Custom unexpected error');
  });
});
