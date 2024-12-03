import { GraphQLResolveInfo } from 'graphql';
import { getUser } from 'src/resolvers/queries/get-user';
jest.mock('../../../src/models/user.model', () => ({
  userModel: {
    findById: jest.fn().mockReturnValue({
      _id: '1',
    }),
  },
}));

describe('get user', () => {
  it('should throw authorization error', async () => {
    try {
      await getUser!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });

  it('should get user', async () => {
    const response = await getUser!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '1',
    });
  });
});
