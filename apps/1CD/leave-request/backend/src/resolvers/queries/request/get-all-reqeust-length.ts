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

export const groupedByStatusRequestLength: QueryResolvers['groupedByStatusRequestLength'] = async (_) => {
  const res = await RequestModel.aggregate([
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
