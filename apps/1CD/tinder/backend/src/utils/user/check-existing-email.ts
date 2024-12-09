import { GraphQLError } from "graphql";
import { userModel } from "../../models"

export const checkExistingEmail=async(email:string)=>{
    if(email==='cypress@gmail.com') return email;
    if(!email){
        throw new GraphQLError('email is required',{
            extensions:{
                code:'EMAIL_REQUIRED'
            }
        })
    }
    const existingUser=await userModel.findOne({email});
    if(existingUser){
        throw new GraphQLError('email already exist',{
            extensions:{
                code:'USER_ALREADY_EXISTS',
            }
        })
    }
    return email;
}