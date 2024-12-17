import { otpModel } from 'src/models';
import { verifyOtp } from 'src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  otpModel: {
    findOne: jest
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        otp: '123456',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() - 1000),
      })
      .mockResolvedValueOnce({
        otp: '123456',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 10000),
      }),
    deleteOne: jest.fn().mockResolvedValue({}),
  },
}));

describe('verifyOtp', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if no matching OTP record is found', async () => {
    await expect(verifyOtp(null, { input: { otp: '1234', email: 'test@example.com' } })).rejects.toThrow('Invalid OTP');

    expect(otpModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com', otp: '1234' });
  });

  it('should throw an error if the OTP has expired', async () => {
    await expect(verifyOtp(null, { input: { otp: '1234', email: 'test@example.com' } })).rejects.toThrow('OTP has expired');

    expect(otpModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com', otp: '1234' });
  });

  it('should verify the OTP and return success message', async () => {
    const result = await verifyOtp(null, { input: { otp: '1234', email: 'test@example.com' } });

    expect(result).toEqual({
      email: 'test@example.com',
      message: 'Email verified successfully',
    });

    expect(otpModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com', otp: '1234' });
    expect(otpModel.deleteOne).toHaveBeenCalledWith({ email: 'test@example.com', otp: '1234' });
  });
});
