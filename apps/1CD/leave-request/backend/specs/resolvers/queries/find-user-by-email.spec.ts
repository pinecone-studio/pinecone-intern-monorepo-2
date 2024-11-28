import { GraphQLResolveInfo } from 'graphql';
import { findUserByEmail } from '../../../src/resolvers/queries';

jest.mock('../../../src/models/user', () => ({
  UserModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({
      email: 'Zolo@gmail.com',
    }),
  },
}));

describe('check user if exist', () => {
  it("user that doesn't exist", async () => {
    const user = await findUserByEmail!({}, { email: 'Zolo2004@gmail.com' }, {}, {} as GraphQLResolveInfo);
    expect(user).toBe(null);
  });
  it('user that exist', async () => {
    const user = await findUserByEmail!({}, { email: 'Zolo@gmail.com' }, {}, {} as GraphQLResolveInfo);
    expect(user).toEqual({
      email: 'Zolo@gmail.com',
    });
  });
});
