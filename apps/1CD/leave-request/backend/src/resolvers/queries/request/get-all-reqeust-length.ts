import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

export const getAllRequestLength: QueryResolvers['getAllRequestLength'] = async (_, { supervisorEmail = '', search = '', status = [], startDate, endDate }) => {
  const query = filter(supervisorEmail, search, status, startDate, endDate);
  if (supervisorEmail) {
    query.supervisorEmail = supervisorEmail;
  }
  const res = await RequestModel.countDocuments(query);
  return { res };
};
const filter = (supervisorEmail: string, search: string, status: string[], startDate: string, endDate: string) => {
  const query: any = {};

  if (status.length) {
    query.result = { $in: status };
  }

  if (startDate) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    query.requestDate = {
      $gte: parsedStartDate,
      $lte: parsedEndDate,
    };
  }

  if (search) {
    query.email = { $regex: search, $options: 'i' };
  }
  return query;
};

export const groupedByStatusRequestLength: QueryResolvers['groupedByStatusRequestLength'] = async (_, {supervisorEmail, startDate, endDate}) => {
  const matchQuery = calculateFilter(supervisorEmail, startDate, endDate);
  const res = await RequestModel.aggregate([
    { $match: matchQuery },
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
  return res;
};

const calculateFilter = (supervisorEmail?: string, startDate?: Date, endDate?: Date) => {
  const matchQuery: any = {};
  if (supervisorEmail) {
    matchQuery.supervisorEmail = supervisorEmail;
  }
  if (startDate) {
    matchQuery.requestDate = dateFilter(startDate, endDate);
  }
  return matchQuery;
};

const dateFilter = (startDate: Date, endDate?:Date) => {
  if(endDate) return { $gte: new Date(startDate), $lte: new Date(endDate) }
}
