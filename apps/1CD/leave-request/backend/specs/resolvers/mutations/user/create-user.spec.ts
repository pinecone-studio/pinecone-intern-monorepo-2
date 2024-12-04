import { GraphQLResolveInfo } from 'graphql';
import { createUser } from '../../../../src/resolvers/mutations';

jest.mock('../../../../src/models/user', () => ({
  UserModel: {
    findOne: jest.fn().mockResolvedValueOnce({ email: 'Zolo' }).mockResolvedValueOnce(null),
    create: jest.fn().mockResolvedValue({
      email: 'Zolo@gmail.com',
      OTP: '9991',
    }),
  },
}));

describe('check user if exist', () => {
  const mockInput = {
    email: 'Zolo2004@gmail.com',
    userName: 'Zolo',
    profile: 'Profile',
    role: 'supervisee',
    position: "engineer",
    hireDate: "2024-11-28T05:09:08.018Z"
  };
  it("user that already existed exist", async () => {
    try {
      await createUser!({}, mockInput, {}, {} as GraphQLResolveInfo);
    } catch (e) {
      expect(e).toEqual(new Error("User exist in this email"));
    }
  });
 
  it('user that exist', async () => {
    const task = await createUser!({}, mockInput, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({
      email: 'Zolo@gmail.com',
      OTP: '9991',
    });
  });
});
