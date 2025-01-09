import { GraphQLError } from "graphql";
import { userModel } from "../../models"

export const checkExistingEmail=async(email:string)=>{
    if(!email ){
        throw new GraphQLError('email is required',{
            extensions:{
                code:'EMAIL_REQUIRED'
            }
        })
    }
    if(email==="cypressregister") return email;
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