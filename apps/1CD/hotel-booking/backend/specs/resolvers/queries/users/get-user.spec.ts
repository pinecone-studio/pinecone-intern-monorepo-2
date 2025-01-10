import { GraphQLResolveInfo } from 'graphql';
import { getUser } from '../../../../src/resolvers/queries/users/get-user';

jest.mock('../../../../src/models', () => ({
  userModel: {
    findById: jest.fn().mockResolvedValue({ _id: '1' }),
  },
}));

describe('get logged user', () => {
  it('should throw authorization error', async () => {
    try {
      await getUser!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('email is not found'));
    }
  });

  it('should get user', async () => {
    const response = await getUser!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '1',
    });
  });
});
