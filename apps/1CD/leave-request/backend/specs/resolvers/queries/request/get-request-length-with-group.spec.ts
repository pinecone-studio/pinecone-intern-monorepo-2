import { GraphQLResolveInfo } from 'graphql';
import { groupedByStatusRequestLength } from 'src/resolvers/queries';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest.fn().mockResolvedValueOnce([
      {
        label: "pending",
        res: 1
      },
    ]),
  },
}));

describe('check supervisor if exist', () => {
  it("supervisor that doesn't exist", async () => {
    const res = await groupedByStatusRequestLength!(
      {},
      { input: { email: 'zolookorzoloo@gmail.com', startDate: '2024-12-04T07:28:05.099Z', endDate: '2024-12-23T07:28:05.099Z', status: ['pending'] } }, 
      {},
      {} as GraphQLResolveInfo
    );
    expect(res).toEqual([
        {
          label: "pending",
          res: 1
        },
      ]);
  });
});
