import { GraphQLError } from 'graphql';
import { MutationResolvers, Response } from '../../../generated';
import { swipeModel } from '../../../models/swipe/swipe.model';
import { Context } from '../../../types';

export const swipeUser: MutationResolvers['swipeUser'] = async (_, { input }, { userId }: Context) => {
    const swiperUser = userId;
    try{
      await swipeModel.create({ ...input, swiperUser });
      return Response.Success; 
    }catch(errpr){
      throw new GraphQLError('Database error occured');
    }
  
};
