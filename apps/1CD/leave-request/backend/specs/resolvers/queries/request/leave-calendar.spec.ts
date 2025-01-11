import { GraphQLResolveInfo } from 'graphql';
import { leaveCalendar } from 'src/resolvers/queries';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest
      .fn()
      .mockResolvedValueOnce([])
      .mockResolvedValue([
        {
          _id: '01-09',
          requests: [
            {
              _id: '677ccb99fd39a80370f3ec34',
              requestType: 'remote',
              message: 'a',
              requestDate: '2025-01-09T16:00:00.000Z',
              startTime: '',
              endTime: '',
              supervisorEmail: 'zolookorzoloo@gmail.com',
              result: 'sent',
              optionalFile: '',
              email: {
                userName: 'amarjargal',
                profile: 'e',
              },
            },
          ],
        },
      ]),
  },
}));

describe('leave calendar test', () => {
  it('when there is no request in given time', async () => {
    const res = await leaveCalendar!({}, { startDate: '2024-11-01', endDate: '2024-11-02' }, {}, {} as GraphQLResolveInfo);
    expect(res).toEqual([
      {
        _id: '11-02',
        request: null,
      },
    ]);
  });
  it('when there is one request in given time', async () => {
    const res = await leaveCalendar!({}, { startDate: '2025-1-08', endDate: '2025-1-30' }, {}, {} as GraphQLResolveInfo);
    expect(res);
  });
  it('when there is one request in given time', async () => {
    const res = await leaveCalendar!({}, { startDate: '2025-1-09', endDate: '2025-1-30' }, {}, {} as GraphQLResolveInfo);
    expect(res);
  });
});
