import { getAllRequests } from "src/resolvers/queries";
import { RequestModel } from "../../../../src/models/request";
import { GraphQLResolveInfo } from "graphql";
import { calculateFilter } from "src/resolvers/queries";
jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest.fn(), 
  },
}));

describe('getAllRequests leave-calendar is exist', () => {
  it("returns grouped requests based on mocked data", async () => {
    const mockedAggregate = RequestModel.aggregate as jest.Mock;
    mockedAggregate.mockResolvedValueOnce([
      {
        _id: { year: 2025, month: 1 },
        requests: [
          {
            email: 'munkhzul.odonkhuu@gmail.com',
            requestDate: '2025-01-15T00:00:00Z',
            result: 'approved',
          },
        ],
      },
    ]);

    const groupedRequests = await getAllRequests!({}, { email: 'munkhzul.odonkhuu@gmail.com'}, {}, {} as GraphQLResolveInfo);
    expect(groupedRequests).toEqual([
      {
        year: 2025,
        month: 1,
        requests: [
          {email: 'munkhzul.odonkhuu@gmail.com',
            requestDate: '2025-01-15T00:00:00Z',
            result: 'approved',
          },
        ],
      },
    ]);
    expect(RequestModel.aggregate).toHaveBeenCalledWith([
      { $match: expect.any(Object) }, 
      {
        $group: {
          _id: { year: { $year: '$requestDate' }, month: { $month: '$requestDate' } },
          requests: { $push: '$$ROOT' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);
  });

  it("handles an empty result gracefully", async () => {
    const mockedAggregate = RequestModel.aggregate as jest.Mock;
    mockedAggregate.mockResolvedValueOnce([]);
    const groupedRequests = await getAllRequests!({}, {  email: 'nonexistentuser@example.com'}, {}, {}  as GraphQLResolveInfo);
    expect(groupedRequests).toEqual([]); 
    expect(RequestModel.aggregate).toHaveBeenCalled();
  });
});

describe('calculateFilter', () => {
  it('should return an empty object when no filters are provided', () => {
    expect(calculateFilter()).toEqual({});
  });

  it('should return an object with email when email is provided', () => {
    const result = calculateFilter("munkhzul@gmail.com");
    expect(result).toEqual({ email: "munkhzul@gmail.com" });
  });

  it('should return an object with email and requestDate when both are provided', () => {
    const startDate = new Date("2025-01-15T00:00:00Z");
    const endDate = new Date("2026-01-15T00:00:00Z");
    const result = calculateFilter("munkhzul@gmail.com", startDate, endDate);
    expect(result).toEqual({
      email: "munkhzul@gmail.com",
      requestDate: { $gte: startDate, $lte: endDate },
    });
  });

  it('should return an object with all filters when all arguments are provided', () => {
    const startDate = new Date("2025-01-15T00:00:00Z");
    const endDate = new Date("2026-01-15T00:00:00Z");
    const result = calculateFilter("munkhzul@gmail.com", startDate, endDate, "approved");
    expect(result).toEqual({
      email: "munkhzul@gmail.com",
      requestDate: { $gte: startDate, $lte: endDate },
      result: "approved",
    });
  });

  it('should return an object with result when only status is provided', () => {
    const result = calculateFilter(undefined, undefined, undefined, "approved");
    expect(result).toEqual({ result: "approved" });
  });

  it('should handle startDate without endDate gracefully', () => {
    const startDate = new Date("2025-01-15T00:00:00Z");
    const result = calculateFilter(undefined, startDate);
    expect(result).toEqual({
      requestDate: { $gte: startDate },
    });
  });
});