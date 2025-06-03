/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { RequestStatus } from 'src/generated';
import { RequestModel } from 'src/models';
import { getPendingRequests } from 'src/resolvers/queries/index';

jest.mock('src/models', () => ({
  RequestModel: {
    aggregate: jest.fn(),
  },
}));

describe('getPendingRequests', () => {
  const mockData = [
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
    (RequestModel.aggregate as jest.Mock).mockResolvedValueOnce(mockData);
    const result = await getPendingRequests!({}, {}, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockData);
  });
});
