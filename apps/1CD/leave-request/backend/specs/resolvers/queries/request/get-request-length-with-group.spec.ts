import { GraphQLResolveInfo } from 'graphql';
import { groupedByStatusRequestLength } from 'src/resolvers/queries';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest.fn(),
  },
}));

const mockAggregate = jest.requireMock('../../../../src/models/request').RequestModel.aggregate;

describe('groupedByStatusRequestLength Resolver', () => {
  const fixedDate = new Date('2023-01-01T00:00:00Z');
  const commonParams = {
    email: 'supervisor@example.com',
    startDate: fixedDate,
    endDate: fixedDate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return grouped request length based on status', async () => {
    // Mock response from the aggregate function
    const mockData = [
      { _id: 'sent', res: 3 },
      { _id: 'pending', res: 5 },
    ];

    // Mock the aggregate function to return mock data
    mockAggregate.mockResolvedValue(mockData);

    // Call the resolver function with the mock parameters
    const result = await groupedByStatusRequestLength!({}, { input: { ...commonParams, status: ['sent', 'pending'] } }, {}, {} as GraphQLResolveInfo);

    // Assert that the result matches the mock data
    expect(result).toEqual(mockData);
    expect(mockAggregate).toHaveBeenCalledWith([
      { 
        $match: { 
          supervisorEmail: commonParams.email, 
          requestDate: { 
            $gte: expect.any(Date), 
            $lte: expect.any(Date),
          },
        },
      },
      { 
        $group: { 
          _id: '$result', 
          res: { $sum: 1 },
        },
      },
      { 
        $sort: { count: -1 },
      },
    ]); // Check if the aggregation pipeline was called correctly
  });

  it('should return empty array if no requests match', async () => {
    // Mock an empty result from aggregate
    mockAggregate.mockResolvedValue([]);

    // Call the resolver with parameters
    const result = await groupedByStatusRequestLength!({}, { input: { ...commonParams, status: ['sent', 'pending'] } }, {}, {} as GraphQLResolveInfo);

    // Assert that the result is an empty array
    expect(result).toEqual([]);
  });

  it('should throw an error on aggregation failure', async () => {
    // Mock an error response from the aggregate function
    mockAggregate.mockRejectedValue(new Error('Database error'));

    // Assert that an error is thrown
    await expect(
      groupedByStatusRequestLength!({}, { input: { ...commonParams, status: ['sent'] } }, {}, {} as GraphQLResolveInfo)
    ).rejects.toThrow('Database error');
  });
});
