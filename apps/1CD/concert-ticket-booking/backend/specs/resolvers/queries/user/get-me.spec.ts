import { GraphQLResolveInfo } from 'graphql';
import { getMe } from '../../../../src/resolvers/queries/user';

jest.mock('../../../../src/models/user.model', () => ({
  findById: jest.fn().mockResolvedValue({ _id: '1' }),
}));

describe('get logged user', () => {
  it('should throw authorization error', async () => {
    try {
      await getMe!({}, {}, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      expect(error).toEqual(new Error('Unauthorized'));
    }
  });

  it('should get user', async () => {
    const response = await getMe!({}, {}, { userId: '1' }, {} as GraphQLResolveInfo);

    expect(response).toEqual({
      _id: '1',
    });
  });
});
