
import { GraphQLError } from "graphql";
import { userModel } from "../../../models"
import { QueryResolvers } from "../../../generated";

export const getUsers:QueryResolvers['getUsers']=async()=>{
    try{
        const users=await userModel.find({});
        return users;
    }catch(error){
        throw new GraphQLError('could not find the users')
    }
}
