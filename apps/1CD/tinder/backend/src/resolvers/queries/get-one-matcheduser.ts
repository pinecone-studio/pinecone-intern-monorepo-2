import { GraphQLError } from 'graphql';
import { QueryResolvers } from '../../generated'
import { userModel } from '../../models';

export const getOneUser: QueryResolvers['getOneUser'] = async (_, { input } ) => {
  const userID = input._id;
  try{
    const oneUser = await userModel.findOne({_id:userID})
    return  oneUser
  }
  catch(error){
    throw new GraphQLError(`Error occured: ${error}`)
  }
};
