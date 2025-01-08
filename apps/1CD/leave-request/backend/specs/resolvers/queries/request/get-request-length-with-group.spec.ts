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
    supervisorEmail: 'supervisor@example.com',
    startDate: fixedDate,
    endDate: fixedDate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return grouped request length based on status', async () => {
    const mockData = [
      { _id: 'sent', res: 3 },
      { _id: 'pending', res: 5 },
    ];

    mockAggregate.mockResolvedValue(mockData);

    const result = await groupedByStatusRequestLength!({}, {  ...commonParams  }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual(mockData);
    expect(mockAggregate).toHaveBeenCalledWith([
      { 
        $match: { 
          supervisorEmail: commonParams.supervisorEmail, 
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
    ]); 
  });

  it('should return empty array if no requests match', async () => {
    mockAggregate.mockResolvedValue([]);

    const result = await groupedByStatusRequestLength!({}, {  ...commonParams }, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual([]);
  });

  it('should throw an error on aggregation failure', async () => {
    mockAggregate.mockRejectedValue(new Error('Database error'));

    await expect(
      groupedByStatusRequestLength!({}, { ...commonParams }, {}, {} as GraphQLResolveInfo)
    ).rejects.toThrow('Database error');
  });
});
