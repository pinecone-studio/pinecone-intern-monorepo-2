import Request from '../../../../src/models/request.model';
import { GraphQLResolveInfo } from 'graphql';
import { getRequests } from '../../../../src/resolvers/queries/request/get-requests';
jest.mock('../../../../src/models/request.model', () => ({
  find: jest.fn(),
}));

describe('getRequests', () => {
  it('should get request', async () => {
    (Request.find as jest.Mock).mockResolvedValueOnce([]);
    const result = await getRequests!({}, {}, { userId: 'test-user-id' }, {} as GraphQLResolveInfo);
    expect(result).toEqual([]);
  });
  it('should throw an error if userId is not provided', async () => {
    await expect(getRequests!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
