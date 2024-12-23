import { GraphQLResolveInfo } from 'graphql';
import { getRequests } from 'src/resolvers/queries';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest.fn().mockResolvedValueOnce([
      {
        email: 'zolookorzoloo@gmail.com',
      },
    ]),
  },
}));

describe('check supervisor if exist', () => {
  it("supervisor that doesn't exist", async () => {
    const res = await getRequests!(
      {},
      { email: 'zolookorzoloo@gmail.com', startDate: '2024-12-04T07:28:05.099Z', endDate: '2024-12-23T07:28:05.099Z', status: 'pending' },
      {},
      {} as GraphQLResolveInfo
    );
    expect(res).toEqual([
      {
        email: 'zolookorzoloo@gmail.com',
      },
    ]);
  });
});
