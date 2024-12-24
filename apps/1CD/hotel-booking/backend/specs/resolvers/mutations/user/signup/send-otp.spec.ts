import { GraphQLResolveInfo } from 'graphql';
import { Response } from 'src/generated';
import { otpModel, userModel } from 'src/models';
import { sendOtp } from 'src/resolvers/mutations';
import { generateOTP } from 'src/utils/generate-otp';
import { sendEmail } from 'src/utils/send-email';

jest.mock('../../../../../src/models', () => ({
  otpModel: {
    create: jest.fn(),
  },
  userModel: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../../../../src/utils/send-email', () => ({
  sendEmail: jest.fn(),
}));
jest.mock('../../../../../src/utils/generate-otp', () => ({
  generateOTP: jest.fn(),
}));

describe('sendOtp', () => {
  const mockOtp = '1234';
  const mockEmail = 'test@gmail.com';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send OTP if user does not exist', async () => {
    const input = { email: mockEmail };

    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (generateOTP as jest.Mock).mockReturnValue(mockOtp);
    (otpModel.create as jest.Mock).mockResolvedValue({ email: mockEmail, otp: mockOtp });
    (sendEmail as jest.Mock).mockResolvedValue({});

    const response = await sendOtp!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual(Response.Success);
  });

  it('should throw an error if the user already exists', async () => {
    const input = { email: mockEmail, otp: mockOtp };

    (userModel.findOne as jest.Mock).mockResolvedValue({ _id: '1' });

    try {
      await sendOtp!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Email already exist'));
    }
  });
  it('should throw an error if there is no email input', async () => {
    await expect(
      sendOtp!(
        {},
        {
          input: {
            email: '',
          },
        },
        { userId: null },
        {} as GraphQLResolveInfo
      )
    ).rejects.toThrow('email is required');
  });
});
