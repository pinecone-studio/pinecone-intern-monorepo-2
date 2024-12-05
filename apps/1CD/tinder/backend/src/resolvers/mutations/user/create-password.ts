import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { MutationResolvers } from "../../../generated";
import { userModel } from "../../../models";

export const createPassword:MutationResolvers['createPassword']=async(_,{input})=>{
    const {email,password}=input;
    const PASS_SALT=process.env.PASS_SALT;
    if(!email||!password){
        throw new GraphQLError('email and pass are required')
    }
    const hashedPassword=await bcrypt.hash(String(password), Number(PASS_SALT))
    const createPassword=await userModel.findOneAndUpdate({email},{password:hashedPassword});
    if(!createPassword){
        throw new GraphQLError('user not found')
    }
    return {email}
}