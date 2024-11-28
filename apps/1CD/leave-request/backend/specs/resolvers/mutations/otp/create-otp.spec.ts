import { GraphQLResolveInfo } from 'graphql';
import { createsOTP } from '../../../../src/resolvers/mutations/otp/create-otp';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({otp: "9999"}),
  })),
}))


jest.mock('../../../../src/models/user', () => ({
  UserModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ email: 'Zolo@gmail.com' }).mockResolvedValueOnce({ email: 'Zolo@gmail.com' }),
  },
}));


jest.mock('../../../../src/models/otp', () => ({
  OTPModel: {
    findOne: jest
      .fn()
      .mockResolvedValueOnce({ expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) })
      .mockResolvedValueOnce({ expirationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }),
    create: jest
      .fn()
      .mockResolvedValue({
        email: 'Zolo@gmail.com',
        OTP: '9991',
      }),
    deleteOne: jest.fn().mockResolvedValue(null)
  },
}));

describe('createsOTP', () => {
  it("user that doesn't exist", async () => {
    try {
      await createsOTP!({}, { email: 'Zolo2004@gmail.com' }, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      expect(e).toEqual(new Error('User not found'));
    }
  });
  it('otp is not expired yet', async () => {
    try {
      await createsOTP!({}, { email: 'Zolo@gmail.com' }, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      expect(e).toEqual(new Error('Old OTP is not expired'));
    }
  });
  it('user that exist', async () => {
    const task = await createsOTP!({}, { email: 'Zolo@gmail.com' }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({
      email: 'Zolo@gmail.com',
      OTP: '9991',
    });
  });
});
