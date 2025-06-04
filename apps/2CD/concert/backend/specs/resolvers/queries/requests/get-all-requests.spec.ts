/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getAllRequests } from 'src/resolvers/queries/requests/get-all-requests';
import { RequestModel } from 'src/models';
import { RequestStatus } from 'src/generated';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('src/models', () => ({
  RequestModel: {
    aggregate: jest.fn(),
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

    (RequestModel.aggregate as jest.Mock).mockReturnValue(mockData);

    const result = await getAllRequests!({}, {}, {}, {} as GraphQLResolveInfo);

    expect(RequestModel.aggregate).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });
});
