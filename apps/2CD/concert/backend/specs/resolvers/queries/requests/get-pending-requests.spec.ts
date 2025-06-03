/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { RequestStatus } from 'src/generated';
import { RequestModel } from 'src/models';
import { getPendingRequests } from 'src/resolvers/queries/index';

jest.mock('src/models', () => ({
  RequestModel: {
    find: jest.fn(),
  },
}));

describe('getPendingRequests', () => {
  const allRequests = [
    {
      id: '1',
      booking: { id: 'b1', time: '2025-05-27' },
      user: { id: 'u1', name: 'Alice' },
      status: RequestStatus.Done,
      bank: 'MockBank',
      bankAccount: '12345678',
      name: 'Alice Kim',
      createdAt: new Date('2025-05-26T00:00:00Z'),
      updatedAt: new Date('2025-05-26T00:00:00Z'),
    },
    {
      id: '2',
      booking: { id: 'b2', time: '2025-05-27' },
      user: { id: 'u2', name: 'Bob' },
      status: RequestStatus.Pending,
      bank: 'AnotherBank',
      bankAccount: '87654321',
      name: 'Bob Choi',
      createdAt: new Date('2025-05-26T00:00:00Z'),
      updatedAt: new Date('2025-05-26T00:00:00Z'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return only pending requests', async () => {
    const populate3 = jest.fn().mockResolvedValue([allRequests[1]]);
    const populate2b = jest.fn().mockReturnValue({ populate: populate3 });
    const populate2a = jest.fn().mockReturnValue({ populate: populate2b });
    const populate1 = jest.fn().mockReturnValue({ populate: populate2a });

    (RequestModel.find as jest.Mock).mockReturnValue({ populate: populate1 });

    const result = await getPendingRequests!({}, {}, {}, {} as GraphQLResolveInfo);

    expect(RequestModel.find).toHaveBeenCalled();
    expect(populate1).toHaveBeenCalledWith('booking');
    expect(populate2a).toHaveBeenCalledWith('user');
    expect(populate2b).toHaveBeenCalledWith({
      path: 'booking',
      populate: {
        path: 'tickets.ticket',
        model: 'Ticket',
      },
    });
    expect(populate3).toHaveBeenCalled();

    expect(result).toEqual([allRequests[1]]);
  });
});
