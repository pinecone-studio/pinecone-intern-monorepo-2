import { GraphQLResolveInfo } from 'graphql';
import { checkMe } from 'src/resolvers/queries';

jest.mock('../../../../src/utils/check-token', () => ({
  checkToken: jest.fn().mockResolvedValue(true),
}));

describe('checks checkMe', () => {
  it('returns true', async () => {
    const res = await checkMe!({}, { roles: ['supervisee', 'admin'] }, {}, {} as GraphQLResolveInfo);
    expect(res)
  });
});
