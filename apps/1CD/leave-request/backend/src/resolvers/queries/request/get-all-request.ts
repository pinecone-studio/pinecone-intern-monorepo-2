import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

export const getRequests: QueryResolvers['getRequests'] = async (_, { email, startDate, endDate, status }) => {
  const matchQuery = calculateFilter(email, startDate, endDate, status);
  const groupedRequests = await RequestModel.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$requestDate' } },
        requests: { $push: '$$ROOT' },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  return groupedRequests;
};

const calculateFilter = (email?: string, startDate?: Date, endDate?: Date, status?: string) => {
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

const dateFilter = (startDate: Date, endDate?:Date) => {
  if(endDate) return { $gte: new Date(startDate), $lte: new Date(endDate) }
}