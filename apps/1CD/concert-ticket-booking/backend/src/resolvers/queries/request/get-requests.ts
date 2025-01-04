import { QueryResolvers, RequestType } from '../../../generated';
import Request from '../../../models/request.model';

export const getRequests: QueryResolvers['getRequests'] = async (_, __, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }
  const requests: RequestType[] = await Request.find({}).populate('eventId').sort({ createdAt: -1 }).lean();
  return requests;
};
