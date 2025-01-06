import { GraphQLError } from "graphql";
import { QueryResolvers } from "../../../generated";
import { userModel } from "../../../models";
import { Context } from "../../../types";

export const getMatchedUser:QueryResolvers['getMatchedUser']=async(_,{matchedUser},{userId}:Context,)=>{
    try{
        const swipedOne=await userModel.findById(matchedUser);
        const swipingOne=await userModel.findById(userId);
        console.log(swipedOne.name)

        return {swipedUserImg:swipedOne.photos[0], userImg:swipingOne.photos[0],swipedName:swipedOne.name}
    }catch(error){
        console.log(error)
        throw new GraphQLError('database error in getUser in matching')
    }

}