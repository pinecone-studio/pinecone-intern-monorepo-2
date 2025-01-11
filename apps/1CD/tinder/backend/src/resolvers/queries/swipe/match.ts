
import { QueryResolvers } from "../../../generated";
import { Matchmodel, userModel } from "../../../models";
import { Context } from "../../../types";

export const getMatchedUser:QueryResolvers['getMatchedUser']=async(_,{matchedUser},{userId}:Context,)=>{
        const matchedUsers=await Matchmodel.find({user1:userId, user2:matchedUser,matched:'true'})
        if(matchedUsers){
            const swipedOne=await userModel.findById(matchedUser);
            const swipingOne=await userModel.findById(userId);
            return {swipedUserImg:swipedOne.photos[0], userImg:swipingOne.photos[0],swipedName:swipedOne.name}
        }
        return {swipedUserImg:null, userImg:null,swipedName:null}
}