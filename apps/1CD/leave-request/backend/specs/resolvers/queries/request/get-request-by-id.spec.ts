import { GraphQLResolveInfo } from 'graphql';
import { getRequestById } from '../../../../src/resolvers/queries/request/get-request-by-id';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({
      _id: '67611496f1031b01f7e6c436',
    }),
  },
}));

describe('check request if exist', () => {
  it("request that doesn't exist", async () => {
    const request = await getRequestById!({}, { _id: '67611496f1031b01f7e6c111' }, {}, {} as GraphQLResolveInfo);
    expect(request).toBe(null);
  });
  it('request that exist', async () => {
    const request = await getRequestById!({}, { _id: '67611496f1031b01f7e6c436' }, {}, {} as GraphQLResolveInfo);
    expect(request).toEqual({
      _id: '67611496f1031b01f7e6c436',
    });
  });
});
