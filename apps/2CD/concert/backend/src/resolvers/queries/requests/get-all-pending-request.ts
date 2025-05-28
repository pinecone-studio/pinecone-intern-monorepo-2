import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

export const getPendingRequests: QueryResolvers['getPendingRequests'] = async () => {
  const pendingRequests = await RequestModel.find({
    status: 'PENDING',
  });

  return pendingRequests;
};
