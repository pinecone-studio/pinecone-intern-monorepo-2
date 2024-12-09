import { GraphQLResolveInfo } from 'graphql';
import { getAllSupervisors } from 'src/resolvers/queries';

jest.mock('../../../src/models/user', () => ({
  UserModel: {
    find: jest.fn().mockResolvedValueOnce([
      {
        email: 'Zolo@gmail.com',
      },
    ]),
  },
}));

describe('give list of supervisors', () => {
  it('supervisors', async () => {
    const supervisors = await getAllSupervisors!({}, {}, {}, {} as GraphQLResolveInfo);
    expect(supervisors).toEqual([
      {
        email: 'Zolo@gmail.com',
      },
    ]);
  });
});
