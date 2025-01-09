import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

// eslint-disable-next-line complexity
export const getAllRequestsBySupervisor: QueryResolvers['getAllRequestsBySupervisor'] = async (_, { supervisorEmail, status = [], page = 1, startDate, endDate, search }) => {
  const query: any = {};
  
  // Add status filter
  if (status.length) {
    query.result = {$in: status};
  }

  // Add date range filter
  if (startDate && endDate) {
    query.requestDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Aggregation pipeline
  const results = await RequestModel.aggregate([
    {
      $match: { supervisorEmail, ...query },
    },
    {
      $lookup: {
        from: 'users', 
        localField: 'email', 
        foreignField: 'email', 
        as: 'email',
      },
    },
    {
      $unwind: '$email', 
    },
    {
      $match: search
        ? {
            'email.userName': { $regex: search, $options: 'i' }, // Case-insensitive search
          }
        : {},
    },
    {
      $skip: (page - 1) * 10,
    },
    {
      $limit: 10, 
    },
    {
      $sort: {
        status: 1, 
      },
    }
  ]);

  return results;
};
