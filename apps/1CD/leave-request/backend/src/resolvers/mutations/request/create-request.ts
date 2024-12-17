import { MutationResolvers } from 'src/generated';
import { RequestModel } from 'src/models/request';
// import { checkToken } from 'src/utils/check-token';

export const createsRequest: MutationResolvers['createsRequest'] = async (_, { email, requestType, requestDate, message, supervisorEmail, startTime, endTime, optionalFile }) => {
  // const isAuthorized = await checkToken('supervisor');
  // if (!isAuthorized) {
  //   throw new Error('Not authorized');
  // }

  const newRequest = await RequestModel.create({ email, requestDate, requestType, message, supervisorEmail, startTime, endTime, optionalFile });

  return newRequest;
};