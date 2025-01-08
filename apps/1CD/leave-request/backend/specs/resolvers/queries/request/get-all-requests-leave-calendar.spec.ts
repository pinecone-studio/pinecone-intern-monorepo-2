import { getAllRequests } from 'src/resolvers/queries';
import { GraphQLResolveInfo } from 'graphql';
jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    aggregate: jest.fn().mockResolvedValue([
      {
        _id: {
          month: '20202',
          year: '2004',
        },

        requests: [],
      },
    ]),
  },
}));

// describe('getAllRequests leave-calendar is exist', () => {
//   // it("returns grouped requests based on mocked data", async () => {
//   //   const mockedAggregate = RequestModel.aggregate as jest.Mock;
//   //   mockedAggregate.mockResolvedValueOnce([
//   //     {
//   //       _id: { year: 2025, month: 1 },
//   //       requests: [
//   //         {
//   //           email: 'munkhzul.odonkhuu@gmail.com',
//   //           requestDate: '2025-01-15T00:00:00Z',
//   //           result: 'approved',
//   //         },
//   //       ],
//   //     },
//   //   ]);
//   //   const groupedRequests = await getAllRequests!({}, { email: 'munkhzul.odonkhuu@gmail.com'}, {}, {} as GraphQLResolveInfo);
//   //   expect(groupedRequests).toEqual([
//   //     {
//   //       year: 2025,
//   //       month: 1,
//   //       requests: [
//   //         {email: 'munkhzul.odonkhuu@gmail.com',
//   //           requestDate: '2025-01-15T00:00:00Z',
//   //           result: 'approved',
//   //         },
//   //       ],
//   //     },
//   //   ]);
//   //   expect(RequestModel.aggregate).toHaveBeenCalledWith([
//   //     { $match: expect.any(Object) },
//   //     {
//   //       $group: {
//   //         _id: { year: { $year: '$requestDate' }, month: { $month: '$requestDate' } },
//   //         requests: { $push: '$$ROOT' },
//   //       },
//   //     },
//   //     { $sort: { '_id.year': -1, '_id.month': -1 } },
//   //   ]);
//   // });
//   // it("handles an empty result gracefully", async () => {
//   //   const mockedAggregate = RequestModel.aggregate as jest.Mock;
//   //   mockedAggregate.mockResolvedValueOnce([]);
//   //   const groupedRequests = await getAllRequests!({}, {  email: 'nonexistentuser@example.com'}, {}, {}  as GraphQLResolveInfo);
//   //   expect(groupedRequests).toEqual([]);
//   //   expect(RequestModel.aggregate).toHaveBeenCalled();
//   // });
// });

describe('calculateFilter', () => {
  it('should return an object with email and requestDate when both are provided', async () => {
    const result = await getAllRequests!({}, { email: 'example@gmail.com', startDate: '2025-01-15T00:00:00Z', endDate: '2025-01-15T00:00:00Z', status: 'pending' }, {}, {} as GraphQLResolveInfo);
    expect(result).toEqual([
      {
        month: '20202',
        year: '2004',
        requests: [],
      },
    ]);
  });

  // it('should return an object with all filters when all arguments are provided', () => {
  //   const result = getAllRequests({},{"munkhzul@gmail.com", startDate, endDate, "approved"});
  //   expect(result).toEqual({
  //     email: "munkhzul@gmail.com",
  //     requestDate: { $gte: startDate, $lte: endDate },
  //     result: "approved",
  //   });
  // });

  // it('should return an object with result when only status is provided', () => {
  //   const result = calculateFilter(undefined, undefined, undefined, "approved");
  //   expect(result).toEqual({ result: "approved" });
  // });

  // it('should handle startDate without endDate gracefully', () => {
  //   const startDate = new Date("2025-01-15T00:00:00Z");
  //   const result = calculateFilter(undefined, startDate);
  //   expect(result).toEqual({
  //     requestDate: { $gte: startDate },
  //   });
  // });
});
