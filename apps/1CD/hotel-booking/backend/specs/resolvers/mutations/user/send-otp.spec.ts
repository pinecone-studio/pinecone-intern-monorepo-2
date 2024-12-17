import { sendOtp } from '../../../../src/resolvers/mutations';
import { otpModel, userModel } from '../../../../src/models';
import { sendEmail } from '../../../../src/utils/send-email';

jest.mock('../../../../src/models', () => ({
  otpModel: {
    create: jest.fn().mockResolvedValueOnce({ _id: '1' }),
  },
  userModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: '1' }),
  },
}));

jest.mock('../../../../src/utils/send-email', () => ({
  sendEmail: jest.fn().mockResolvedValueOnce({}),
}));

describe('sendOtp', () => {
  const input = { email: 'test@gmail.com', message: 'OTP sent successfully' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send OTP if user does not exist', async () => {
    const response = await sendOtp({}, { input });

    expect(response).toEqual({
      email: 'test@gmail.com',
      message: 'OTP sent successfully',
    });

    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@gmail.com' });

    expect(otpModel.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@gmail.com' }));
    expect(sendEmail).toHaveBeenCalledWith('test@gmail.com', expect.any(String));
  });

  it('should throw an error if the user already exists', async () => {
    await expect(sendOtp({}, { input })).rejects.toThrow('user exists');

    expect(otpModel.create).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });
  it('should throw an error if there is no email input', async () => {
    await expect(
      sendOtp(
        {},
        {
          input: {
            email: '',
          },
        }
      )
    ).rejects.toThrow('Email is required');
  });
});
