import { GraphQLError } from "graphql";
import { MutationResolvers } from "../../../generated";
import { userModel } from "../../../models";

export const createPassword:MutationResolvers['createPassword']=async(_,{input})=>{
    const {email,password}=input;
    if(!email||!password){
        throw new GraphQLError('email and pass are required')
    }
    const createPassword=await userModel.findOneAndUpdate({email},{password:password});
    if(!createPassword){
        throw new GraphQLError('user not found')
    }
    return {email}
}