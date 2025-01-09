import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

export const getAllRequests: QueryResolvers['getAllRequests'] = async (_, { email, startDate, endDate, status }) => {
  const matchQuery = calculateFilter(email, startDate, endDate, status);
  const groupedRequests = await RequestModel.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          year: { $year: '$requestDate' },
          month: { $month: '$requestDate' },
        },
        requests: { $push: '$$ROOT' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);

  return groupedRequests.map((group) => ({
    year: group._id.year,
    month: group._id.month,
    requests: group.requests,
  }));
};

const calculateFilter = (email?: string | undefined, startDate?: Date, endDate?: Date, status?: string) => {
  const matchQuery: any = {};
  if (email) {
    matchQuery.email = email;
  }
  if (startDate) {
    matchQuery.requestDate = dateFilter(startDate, endDate);
  }
  if (status) {
    matchQuery.result = status;
  }
  return matchQuery;
};
const dateFilter = (startDate: Date, endDate?: Date) => {
  return { $gte: new Date(startDate), $lte: new Date(endDate!) };
};
