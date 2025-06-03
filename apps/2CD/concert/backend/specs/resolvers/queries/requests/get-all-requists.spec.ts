/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getAllRequists } from 'src/resolvers/queries/requests/get-all-requists';
import { RequestModel } from 'src/models';
import { RequestStatus } from 'src/generated';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('src/models', () => ({
  RequestModel: {
    find: jest.fn(),
  },
}));

describe('getAllRequests resolver', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return populated requests', async () => {
    const mockData = [
      {
        id: '1',
        booking: { id: 'b1', time: '2025-05-27' },
        user: { id: 'u1', name: 'Alice' },
        status: RequestStatus.Done,
        bank: 'MockBank',
        bankAccount: '12345678',
        name: 'Alice Kim',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const populate3 = jest.fn().mockResolvedValue(mockData);
    const populate2b = jest.fn().mockReturnValue({ populate: populate3 });
    const populate2a = jest.fn().mockReturnValue({ populate: populate2b });
    const populate1 = jest.fn().mockReturnValue({ populate: populate2a });

    (RequestModel.find as jest.Mock).mockReturnValue({ populate: populate1 });

    const result = await getAllRequists!({}, {}, {}, {} as GraphQLResolveInfo);

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
    expect(populate3).toHaveBeenCalled(); // triggers final populate
    expect(result).toEqual(mockData);
  });
});
