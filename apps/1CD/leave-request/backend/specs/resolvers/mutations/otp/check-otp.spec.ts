import { checkOTP } from '../../../../src/resolvers/mutations/otp/check-otp';

jest.setTimeout(15000)

jest.mock('../../../../src/utils/create-token', () => ({
  createToken: jest.fn().mockResolvedValueOnce('a2f2voir2j2nvo2ijf2ef24'),
}));

jest.mock('../../../../src/models/otp', () => ({
  OTPModel: {
    findOne: jest
      .fn()
      .mockResolvedValueOnce(null)  // Simulating "User not found"
      .mockResolvedValueOnce({ expirationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) })  // Expired OTP
      .mockResolvedValueOnce({ expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }),  // Valid OTP
    deleteOne: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('../../../../src/models/user', () => ({
  UserModel: {
    findOne: jest.fn().mockResolvedValueOnce({_id: 13, userName: "Zolo", role: 'Supervisee', position: "Engineer"})
  }
}))

describe('check user if exist', () => {
  it("user that doesn't exist", async () => {
    try {
      await checkOTP({}, { email: 'Zolo2004@gmail.com', OTP: '199300' });
    } catch (e) {
      expect(e).toEqual(new Error('User not found'));
    }
  });
  it('check otp is expired', async () => {
    try {
      await checkOTP({}, { email: 'Zolo2004@gmail.com', OTP: '200100' });
    } catch (e) {
      expect(e).toEqual(new Error('OTP is expired'));
    }
  });
  it('user that exist', async () => {
    const task = await checkOTP({}, { email: 'Zolo2004@gmail.com', OTP: '199200' });

    expect(task).toEqual('a2f2voir2j2nvo2ijf2ef24');
  });
});
