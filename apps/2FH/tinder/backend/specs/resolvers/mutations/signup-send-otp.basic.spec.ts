import { signupSendOtp } from 'src/resolvers/mutations/signup-send-otp-mutation';
import { User } from 'src/models';
import { OtpStore } from 'src/models/signup-otp-model';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
import { GraphQLError } from 'graphql';

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

describe('signupSendOtp - Basic Functionality', () => {
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

  it('should throw error if OTP generation fails', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (sendUserVerificationLink as jest.Mock).mockResolvedValue(null);

    await expect(signupSendOtp!({}, { email: mockEmail }, mockContext as any, {} as any)).rejects.toThrow('Failed to generate OTP');

    expect(OtpStore.create).not.toHaveBeenCalled();
  });
});
