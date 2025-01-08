import { GraphQLResolveInfo } from 'graphql';
import { getAllRequestLength } from 'src/resolvers/queries';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    countDocuments: jest.fn(),
  },
}));

const mockCountDocuments = jest.requireMock('../../../../src/models/request').RequestModel.countDocuments;

describe('getAllRequestLength Resolver', () => {
  const fixedDate = new Date('2023-01-01T00:00:00Z');
  const commonParams = {
    email: 'amarjargal.ts01@gmail.com',
    startDate: fixedDate,
    endDate: fixedDate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    {
      params: { ...commonParams, status: ['sent'], search: 'example' },
      expected: { res: 2 },
    },
    {
      params: { ...commonParams, search: 'example' },
      expected: { res: 2 },
    },
    {
      params: commonParams,
      expected: { res: 2 },
    },
    {
      params: { supervisorEmail: 'amarjargal.ts01@gmail.com' },
      expected: { res: 2 },
    },
  ])('should return correct request length for $params', async ({ params, expected }) => {
    mockCountDocuments.mockResolvedValue(2);

    const result = await getAllRequestLength!({}, params, {}, {} as GraphQLResolveInfo);

    expect(result).toEqual(expected);
    expect(mockCountDocuments).toHaveBeenCalled();
  });

  it('should return 0 when no documents match', async () => {
    mockCountDocuments.mockResolvedValue(0);

    const result = await getAllRequestLength!({}, {}, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual({ res: 0 });
  });

  it('should throw an error on database failure', async () => {
    mockCountDocuments.mockRejectedValue(new Error('Database error'));

    await expect(
      getAllRequestLength!({}, {}, {}, {} as GraphQLResolveInfo)
    ).rejects.toThrow('Database error');
  });
});
