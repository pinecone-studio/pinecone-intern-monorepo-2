import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { MutationResolvers } from "../../../generated";
import { userModel } from "../../../models";
import { Context } from "../../../types";


export const createPassword:MutationResolvers['createPassword']=async(_,{input},{userId}:Context)=>{
    const {password}=input;
    const PASS_SALT=process.env.PASS_SALT;
    if(!password){
        throw new GraphQLError('Password is required. Please enter a password to continue.')
    }
    const hashedPassword=await bcrypt.hash(String(password), Number(PASS_SALT))
    const user=await userModel.findOneAndUpdate({_id:userId},{password:hashedPassword});
    if(!user){
        throw new GraphQLError('User not found. Please check if the username or email is correct.')
    }
    return {email:user.email}
}