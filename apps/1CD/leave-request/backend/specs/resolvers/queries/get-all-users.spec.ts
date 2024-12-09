import { GraphQLResolveInfo } from 'graphql';
import { getAllUsers } from 'src/resolvers/queries/get-all-user';

jest.mock('../../../src/models/user', () => ({
  UserModel: {
    find: jest.fn().mockResolvedValueOnce([
      {
        email: 'Zolo@gmail.com',
      },
    ]),
  },
}));
describe('should render all the users', () => {
  it('get all users ', async () => {
    const task = await getAllUsers!({}, {}, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual([
      {
        email: 'Zolo@gmail.com',
      },
    ]);
  });
});
