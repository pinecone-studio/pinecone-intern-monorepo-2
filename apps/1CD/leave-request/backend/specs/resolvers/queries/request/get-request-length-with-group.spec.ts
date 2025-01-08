import { GraphQLResolveInfo } from 'graphql';
import { groupedByStatusRequestLength } from 'src/resolvers/queries';
import { RequestModel } from '../../../../src/models/request';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest.fn() as jest.Mock,  // Mock-г TypeScript-ийг зөв ойлгохыг зааж өгнө
  },
}));

describe('check supervisor if exist', () => {
  it("supervisor that doesn't exist", async () => {
    // aggregate-ийг mockResolvedValueOnce ашиглан тохируулах
    (RequestModel.aggregate as jest.Mock).mockResolvedValueOnce([
      {
        label: "pending",
        res: 1
      },
    ]);

    const res = await groupedByStatusRequestLength!(
      {},
      { input: { email: 'zolookorzoloo@gmail.com', startDate: '2024-12-04T07:28:05.099Z', endDate: '2024-12-23T07:28:05.099Z' } },
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
