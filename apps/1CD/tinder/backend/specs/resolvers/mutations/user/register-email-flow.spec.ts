// import { userModel } from "/1CD/tinder/backend/src/models";
import { userModel } from '../../../../src/models';
import { registerEmail } from '../../../../src/resolvers/mutations';
import { checkExistingEmail } from '../../../../src/utils/user/check-existing-email';
import { generateOTP } from '../../../../src/utils/user/generate-otp';
import { sendOtpMail } from '../../../../src/utils/user/send-otp-email';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models', () => ({
  userModel: {
    create: jest.fn(),
  },
}));

jest.mock('../../../../src/utils/user/check-existing-email', () => ({
  checkExistingEmail: jest.fn(),
}));
jest.mock('../../../../src/utils/user/generate-otp', () => ({
  generateOTP: jest.fn(),
}));

jest.mock('../../../../src/utils/user/send-otp-email', () => ({
  sendOtpMail: jest.fn(),
}));

describe('registerEmailmutation', () => {
  const mockEmail = 'example@gmail.com';
  const mockOtp = 1234;
  const mockInfo = {} as GraphQLResolveInfo;

  it('it should successfully register a new user', async () => {
    const input = { email: mockEmail };

    (checkExistingEmail as jest.Mock).mockResolvedValue(mockEmail);
    (generateOTP as jest.Mock).mockReturnValue(mockOtp);
    (userModel.create as jest.Mock).mockResolvedValue({
      email: mockEmail,
      otp: mockOtp,
    });
    (sendOtpMail as jest.Mock).mockResolvedValue('Email sent successfully');
    const result = await registerEmail!({}, { input }, {}, mockInfo);
    expect(checkExistingEmail).toHaveBeenCalledWith(mockEmail);
    expect(generateOTP).toHaveBeenLastCalledWith();
    expect(userModel.create).toHaveBeenCalledWith({
      email: mockEmail,
      otp: mockOtp,
    });
    expect(sendOtpMail).toHaveBeenCalledWith(mockEmail, mockOtp);
    expect(result).toEqual({
      email: mockEmail,
    });
  });
  it('should throw error if user creation fails', async () => {
    const input = { email: mockEmail };
    (checkExistingEmail as jest.Mock).mockResolvedValue(mockEmail);
    (generateOTP as jest.Mock).mockReturnValue(mockOtp);
    (userModel.create as jest.Mock).mockRejectedValue(new Error('Database Error'));

    await expect(registerEmail!({}, { input }, {}, mockInfo)).rejects.toThrow(GraphQLError);
    await expect(registerEmail!({}, { input }, {}, mockInfo)).rejects.toMatchObject({ extensions: { code: 'USER_CREATION_FAILED' } });
  });
});
