import { userModel } from '../../../../src/models/user/user.model';
import { generateOTP } from '../../../../src/utils/user/generate-otp';
import { sendOtpMail } from '../../../../src/utils/user/send-otp-email';
import { checkEmail } from '../../../../src/resolvers/mutations/user/checkEmail';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/user/user.model', () => ({
  userModel: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
}));

jest.mock('../../../../src/utils/user/generate-otp', () => ({
  generateOTP: jest.fn(),
}));

jest.mock('../../../../src/utils/user/send-otp-email', () => ({
  sendOtpMail: jest.fn(),
}));

describe('checkEmailmutation', () => {
  const mockEmail = 'example@gmail.com';
  const mockOtp = 1234;
  const mockInfo = {} as GraphQLResolveInfo;

  it('should throw an error if email is not found', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    const input = { email: mockEmail };

    await expect(checkEmail!({}, { input }, {}, mockInfo)).rejects.toThrow(GraphQLError);
    await expect(checkEmail!({}, { input }, {}, mockInfo)).rejects.toMatchObject({
      extensions: { code: 'EMAIL_NOT_FOUND' },
    });

    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockEmail });
  });

  it('should send OTP and return email if email is found', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue({
      email: mockEmail,
      save: jest.fn().mockResolvedValue(true),
    });
    (generateOTP as jest.Mock).mockReturnValue(mockOtp);
    (sendOtpMail as jest.Mock).mockResolvedValue('Email sent successfully');

    const input = { email: mockEmail };

    const result = await checkEmail!({}, { input }, {}, mockInfo);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockEmail });
    expect(generateOTP).toHaveBeenCalled();
    expect(sendOtpMail).toHaveBeenCalledWith(mockEmail, mockOtp);
    expect(result).toEqual({ email: mockEmail });
  });

  it('should save the OTP in the user record', async () => {
    const user = {
      email: mockEmail,
      save: jest.fn().mockResolvedValue(true),
      otp: undefined as number | undefined,
    };
    (userModel.findOne as jest.Mock).mockResolvedValue(user);
    (generateOTP as jest.Mock).mockReturnValue(mockOtp);

    const input = { email: mockEmail };

    await checkEmail!({}, { input }, {}, mockInfo);

    expect(user.otp).toBe(mockOtp);
    expect(user.save).toHaveBeenCalled();
  });
});
