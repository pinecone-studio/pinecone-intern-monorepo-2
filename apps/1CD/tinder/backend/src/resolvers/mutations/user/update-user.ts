import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';

export const updateUser: MutationResolvers['updateUser'] = async (_, { email, name, bio, interests, profession, schoolWork }) => {

  const user = await userModel.findOne({ email:email});
  if (!user) {
    throw new Error('Could not find user');
  }
  try{
 
  const oneUser = await userModel.findOneAndUpdate({email}, { name, bio, interests, profession, schoolWork }, { new: true });
  return oneUser;
}
catch (error){
  console.log(error)
  throw new GraphQLError(`Internal server error: ${error}`)
}
};
