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

    const populateMock = jest.fn().mockReturnThis();
    const populateMock2 = jest.fn().mockResolvedValueOnce(mockData);

    (RequestModel.find as jest.Mock).mockReturnValue({
      populate: populateMock.mockReturnValue({
        populate: populateMock2,
      }),
    });

    const result = await getAllRequists!({}, {}, {}, {} as GraphQLResolveInfo);

    expect(RequestModel.find).toHaveBeenCalled();
    expect(populateMock).toHaveBeenCalledWith('booking');
    expect(populateMock2).toHaveBeenCalledWith('user');
    expect(result).toEqual(mockData);
  });
});
