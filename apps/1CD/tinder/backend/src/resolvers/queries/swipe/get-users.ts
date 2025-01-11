

import { userModel } from "../../../models"
import { QueryResolvers } from "../../../generated";
import { Context } from "../../../types";

export const getUsers:QueryResolvers['getUsers']=async(_,__,{userId}:Context)=>{

        const user=await userModel.findById({_id:userId});

       
        if(user.attraction==='both'){
            const users=await userModel.find({ _id: { $ne: userId } });
            return users;
        }
        const users=await userModel.find({ _id: { $ne: userId } , gender:user.attraction});
        return users;
    
}
