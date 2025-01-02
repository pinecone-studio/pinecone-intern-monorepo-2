import { QueryResolvers } from 'src/generated';
import { RequestModel, UserModel } from 'src/models';

export const openRequest: QueryResolvers['openRequest'] = async (_, { _id }) => {
    
  let request = await RequestModel.findById(_id)
  if(request.result == "sent"){
    request = await RequestModel.findByIdAndUpdate({ _id }, { $set: { result: 'pending' } }, { new: true });
  }
  const user = await UserModel.findOne({email: request.email})
  if(!user){
    throw new Error("user not found")
  }
  return {...request.toObject(), userName: user.userName};
};
