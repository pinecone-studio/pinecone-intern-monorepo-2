

import { MutationResolvers } from "../../../generated";
import { userModel } from "../../../models";
import { Context } from "../../../types";


export const getMe:MutationResolvers['getMe']=async(_,__,{userId}:Context)=>{
    const user=await userModel.findById(userId);
    return user;    
}