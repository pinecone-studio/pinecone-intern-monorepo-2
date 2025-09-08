import { signupSendOtp } from 'src/resolvers/mutations/signup-send-otp-mutation';
import { User } from 'src/models';
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

describe('signupSendOtp - Error Handling', () => {
  const mockEmail = 'test@example.com';

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
