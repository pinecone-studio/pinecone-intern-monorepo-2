import { userModel } from '../../../../src/models/user/user.model';
import { generateOTP } from '../../../../src/utils/user/generate-otp';
import { sendOtpMail } from '../../../../src/utils/user/send-otp-email';
import { checkEmail } from '../../../../src/resolvers/mutations/user/check-email';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/user/user.model', () => ({
  userModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

jest.mock('../../../../src/utils/user/generate-otp', () => ({
  generateOTP: jest.fn(),
}));

jest.mock('../../../../src/utils/user/send-otp-email', () => ({
  sendOtpMail: jest.fn(),
}));

describe('check-Emailmutation', () => {
  const mockEmail = 'cypress@gmail.com';
  const mockOtp = '0000';
  const mockInfo = {} as GraphQLResolveInfo;
  const userId=null

  it('should throw an error if email is not found', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    const input = { email: 'ara@gmail.com' };

    await expect(checkEmail!({}, { input }, {userId}, mockInfo)).rejects.toThrow(GraphQLError);
    await expect(checkEmail!({}, { input }, {userId}, mockInfo)).rejects.toMatchObject({
      extensions: { code: 'EMAIL_NOT_FOUND' },
    });
  });

  it('should send OTP and return email if email is found', async () => {
    (userModel.findOne as jest.Mock).mockResolvedValue({
      email: mockEmail,
      save: jest.fn().mockResolvedValue(true),
    });
    (generateOTP as jest.Mock).mockReturnValue(mockOtp);
    (sendOtpMail as jest.Mock).mockResolvedValue('Email sent successfully');

    const input = { email: mockEmail };

    const result = await checkEmail!({}, { input }, {userId}, mockInfo);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: mockEmail });
    expect(generateOTP).toHaveBeenCalled();
    expect(sendOtpMail).toHaveBeenCalledWith(mockEmail, mockOtp);
    expect(result).toEqual({ email: mockEmail });
  });

  
});
