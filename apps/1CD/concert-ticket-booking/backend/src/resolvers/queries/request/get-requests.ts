import { QueryResolvers } from '../../../generated';
import Request from '../../../models/request.model';

export const getRequests: QueryResolvers['getRequests'] = async (_, __, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const requests = Request.find();
  return requests;
};
