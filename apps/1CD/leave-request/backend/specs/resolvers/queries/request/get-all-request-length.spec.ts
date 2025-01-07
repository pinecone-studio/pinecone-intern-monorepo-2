import { GraphQLResolveInfo } from 'graphql';
import { getAllRequestLength } from 'src/resolvers/queries';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    countDocuments: jest.fn().mockResolvedValue(2),
  },
}));

describe('find length of requests', () => {
  it('should get one request', async () => {
    const task = await getAllRequestLength!({}, { status: ['sent'], search: 'example', startDate: new Date(), endDate: new Date(), supervisorEmail: 'asdf' }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({ res: 2 });
  });
  it('should get one request', async () => {
    const task = await getAllRequestLength!({}, { search: 'example', startDate: new Date(), endDate: new Date(), supervisorEmail: 'asdf' }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({ res: 2 });
  });
  it('should get one request', async () => {
    const task = await getAllRequestLength!({}, { startDate: new Date(), endDate: new Date(), supervisorEmail: 'asdf' }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({ res: 2 });
  });
  it('should get one request', async () => {
    const task = await getAllRequestLength!({}, { }, {}, {} as GraphQLResolveInfo);
    expect(task).toEqual({ res: 2 });
  });

});
