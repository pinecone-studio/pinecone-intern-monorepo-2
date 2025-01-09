import { GraphQLResolveInfo } from 'graphql';
import { getAllRequestsBySupervisor } from '../../../../src/resolvers/queries/request/get-requests';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValue([
        {
          supervisor: 'amarjargal.ts01@gmail.com',
        },
      ]),
  },
}));

describe('check supervisor if exist', () => {
  it("supervisor that doesn't exist", async () => {
    const supervisor = await getAllRequestsBySupervisor!({}, { supervisorEmail: 'amarjargal@gmail.com' }, {}, {} as GraphQLResolveInfo);
    expect(supervisor).toBe(null);
  });
  it('filter with status', async () => {
    const supervisor = await getAllRequestsBySupervisor!({}, { supervisorEmail: 'amarjargal@gmail.com', status: ['pending'] }, {}, {} as GraphQLResolveInfo);
    expect(supervisor).toEqual([
      {
        supervisor: 'amarjargal.ts01@gmail.com',
      },
    ]);
  });
  it('filter with startDate', async () => {
    const supervisor = await getAllRequestsBySupervisor!({}, { supervisorEmail: 'amarjargal@gmail.com', startDate: '2024-12-27T08:02:59.942Z', endDate: "2024-12-27T08:02:59.942Z", search: "ZOl" }, {}, {} as GraphQLResolveInfo);
    expect(supervisor).toEqual([
      {
        supervisor: 'amarjargal.ts01@gmail.com',
      },
    ]);
  });
});
