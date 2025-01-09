import { QueryResolvers } from "../../generated";
import { userModel } from "../../models/user/user.model";

export const getMe: QueryResolvers['getMe']=async(_,__,{userId})=>{
    const user=await userModel.findById(userId);
    return user;    
}