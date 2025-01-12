import { GraphQLError } from 'graphql';
import { MutationResolvers} from '../../../generated';
import { swipeModel } from '../../../models/swipe/swipe.model';
import { Context } from '../../../types';
import { Matchmodel } from '../../../models';

export const swipeUser: MutationResolvers['swipeUser'] = async (_, { input }, { userId }: Context) => {
    const swiperUser = userId;
    const swipedUser=input.swipedUser;
    try{
      await swipeModel.create({ ...input, swiperUser });
      if(input.type==='liked'){
        const res=await swipeModel.findOne({swiperUser:swipedUser,swipedUser:swiperUser,type:'liked'})
        if(!res)return {matchedWith:swipedUser,swiped:'successful',matched:false}
        await Matchmodel.create({user1:swipedUser, user2:swiperUser, matched:'true'})
        return {matchedWith:swipedUser,swiped:'successful',matched:true}
      }
      return {swiped:'successful',matched:false,matchedWith:'none'}; 
    }catch(errpr){
      throw new GraphQLError('Database error occured');
    }
  
};
