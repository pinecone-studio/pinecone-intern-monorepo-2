/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { RequestModel } from 'src/models';
import { getPendingRequests } from 'src/resolvers/queries/index';

jest.mock('src/models', () => ({
  RequestModel: {
    find: jest.fn(),
  },
}));

describe('getPendingRequests', () => {
  const allRequests = [
    { status: 'PENDING', name: 'test' },
    { status: 'PENDING', name: 'test1' },
    { status: 'DONE', name: 'test2' },
  ];

  const pendingOnly = allRequests.filter((r) => r.status === 'PENDING');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return only pending requests', async () => {
    (RequestModel.find as jest.Mock).mockResolvedValue(pendingOnly);
    const result = await getPendingRequests!({}, {}, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual([
      { status: 'PENDING', name: 'test' },
      { status: 'PENDING', name: 'test1' },
    ]);
  });
});
