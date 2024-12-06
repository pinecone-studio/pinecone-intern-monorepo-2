import { MutationResolvers } from 'src/generated';
import { RequestModel } from 'src/models/request';
import { checkToken } from 'src/utils/check-token';

export const createsRequest: MutationResolvers['createsRequest'] = async (_, { email, requestType, requestDate, message, supervisorEmail }) => {
  const isAuthorized = await checkToken('admin');
  if (!isAuthorized) {
    throw new Error('Not authorized');
  }

  const newRequest = await RequestModel.create({ email, requestDate, requestType, message, supervisorEmail });

  return newRequest;
};
