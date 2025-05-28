import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';
export const getAllRequists: QueryResolvers['getAllRequists'] = async () => {
  const getAllRequists = await RequestModel.find();
  return getAllRequists;
};
