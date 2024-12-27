import { GraphQLResolveInfo } from 'graphql';
import { getAllRequestsBySupervisor } from '../../../../src/resolvers/queries/request/get-requests';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({
      supervisor: 'amarjargal.ts01@gmail.com',
    }),
  },
}));

describe('check supervisor if exist', () => {
  it("supervisor that doesn't exist", async () => {
    const supervisor = await getAllRequestsBySupervisor!({}, { supervisorEmail: 'amarjargal@gmail.com' }, {}, {} as GraphQLResolveInfo);
    expect(supervisor).toBe(null);
  });
});