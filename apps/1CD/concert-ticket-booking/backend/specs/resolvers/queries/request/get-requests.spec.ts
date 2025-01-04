import Request from '../../../../src/models/request.model';
import { GraphQLResolveInfo } from 'graphql';
import { getRequests } from '../../../../src/resolvers/queries/request/get-requests';

// Correct mock setup
jest.mock('../../../../src/models/request.model', () => ({
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([
          {
            _id: '1',
            name: 'test-name',
          },
        ]),
      }),
    }),
  }),
}));

describe('getRequests', () => {
  beforeEach(() => {
    (Request.find as jest.Mock).mockClear();
  });

  it('should get request', async () => {
    const result = await getRequests!({}, {}, { userId: 'test-user-id' }, {} as GraphQLResolveInfo);
    expect(result).toEqual([
      {
        _id: '1',
        name: 'test-name',
      },
    ]);
  });

  it('should throw an error if userId is not provided', async () => {
    await expect(getRequests!({}, {}, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
