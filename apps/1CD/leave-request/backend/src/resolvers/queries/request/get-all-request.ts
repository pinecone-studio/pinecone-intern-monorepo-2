import { QueryResolvers } from "src/generated";
import { RequestModel } from "src/models";

export const getRequests: QueryResolvers['getRequests'] = async (_, { email, startDate, endDate, status }) => {
  let matchQuery: any = {};

  if (email) {
    matchQuery.email = email;
  }
  if (startDate && endDate) {
    matchQuery.requestDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (status) {
    matchQuery.result = status;
  }

  const groupedRequests = await RequestModel.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$requestDate" } },
        requests: { $push: "$$ROOT" },
      },
    },
    { $sort: { _id: -1 } }, 
  ]);

  
  return groupedRequests
};
