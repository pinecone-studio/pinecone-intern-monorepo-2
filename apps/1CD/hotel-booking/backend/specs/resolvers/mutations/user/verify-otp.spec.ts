import { otpModel } from 'src/models';
import { verifyOtp } from '../../../../src/resolvers/mutations';
import { GraphQLResolveInfo } from 'graphql';
import { Response } from 'src/generated';

jest.mock('../../../../src/models', () => ({
  otpModel: {
    findOne: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe('verifyOtp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockOtp = '1234';
  const mockEmail = 'test@example.com';

  it('should throw an error if no matching OTP record is found', async () => {
    const input = { email: mockEmail, otp: mockOtp };

    (otpModel.findOne as jest.Mock).mockResolvedValue(null);

    try {
      await verifyOtp!({}, { input }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Invalid OTP'));
    }
  });

  it('should throw an error if the OTP has expired', async () => {
    const expiredOtpRecord = {
      email: mockEmail,
      otp: mockOtp,
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
    };

    (otpModel.findOne as jest.Mock).mockResolvedValue(expiredOtpRecord);

    try {
      await verifyOtp!({}, { input: { email: mockEmail, otp: mockOtp } }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('OTP has expired'));
    }

    expect(otpModel.findOne).toHaveBeenCalledWith({ email: mockEmail, otp: mockOtp });
  });
  it('should verify the OTP and return success message', async () => {
    const validOtpRecord = {
      email: mockEmail,
      otp: mockOtp,
      createdAt: new Date(),
    };

    (otpModel.findOne as jest.Mock).mockResolvedValue(validOtpRecord);
    (otpModel.deleteOne as jest.Mock).mockResolvedValue({});

    const result = await verifyOtp!({}, { input: { email: mockEmail, otp: mockOtp } }, { userId: null }, {} as GraphQLResolveInfo);

    expect(result).toEqual(Response.Success);
    expect(otpModel.findOne).toHaveBeenCalledWith({ email: mockEmail, otp: mockOtp });
    expect(otpModel.deleteOne).toHaveBeenCalledWith({ email: mockEmail, otp: mockOtp });
  });
});
