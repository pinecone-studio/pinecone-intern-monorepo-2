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
    const populateMock = jest.fn().mockReturnThis();
    const populateMock2 = jest.fn().mockResolvedValueOnce([
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
    ]);

    (RequestModel.find as jest.Mock).mockReturnValue({
      populate: populateMock.mockReturnValue({
        populate: populateMock2,
      }),
    });

    const result = await getPendingRequests!({}, {}, {}, {} as GraphQLResolveInfo);

    expect(RequestModel.find).toHaveBeenCalled();
    expect(populateMock).toHaveBeenCalledWith('booking');
    expect(populateMock2).toHaveBeenCalledWith('user');

    expect(result).toEqual([allRequests[1]]);
  });
});
