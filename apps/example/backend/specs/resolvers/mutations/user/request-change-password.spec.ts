import { GraphQLResolveInfo } from 'graphql';
import { requestChangePassword } from '../../../../src/resolvers/mutations/user/request-change-password';

jest.mock('../../../../src/models', () => ({
  userModel: {
    updateOne: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('../../../../src/library/nodemailer', () => ({
  sendEmail: jest.fn().mockResolvedValue({}),
}));

describe('Change password', () => {
  it('should change', async () => {
    const response = await requestChangePassword!({}, { input: { email: '' } }, { userId: null }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      email: '',
    });
  });
});
