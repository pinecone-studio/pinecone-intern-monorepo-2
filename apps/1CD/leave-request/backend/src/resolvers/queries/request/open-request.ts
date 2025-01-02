import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

export const openRequest: QueryResolvers['openRequest'] = async (_, { _id }) => {
  let request = await RequestModel.findById(_id)
  if(request.result == "sent"){
    request = await RequestModel.findByIdAndUpdate({ _id }, { $set: { result: 'pending' } }, { new: true });
  }
  return request;
};
