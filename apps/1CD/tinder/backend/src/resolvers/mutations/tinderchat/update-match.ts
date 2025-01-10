import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { Matchmodel } from '../../../models';
import { Context } from '../../../types';

export const updateMatch: MutationResolvers['updateMatch'] = async (_, { input },{userId}:Context) => {
 const user1 = input.user1
 try{
    await Matchmodel.updateOne(
        {
          $or: [
            { user1: user1, user2: userId },
            { user2: user1, user1: userId },
          ],
        },
        {
          $set: { matched: false },
        }
      )
    return {matched:false}
 }
 catch (error){
    throw new GraphQLError(`Error occured: ${error}`)
 }
};
