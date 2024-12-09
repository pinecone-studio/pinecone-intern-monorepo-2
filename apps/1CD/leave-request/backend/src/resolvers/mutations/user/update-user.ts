import { MutationResolvers } from "../../../generated";
import { UserModel } from "../../../models";

export const updateUser : MutationResolvers['updateUser'] = async (_ : unknown, {email, userName, profile, role, position, supervisor, hireDate}) => {

    const findUser = await UserModel.findOne({email})


    if(!findUser){
        throw new Error("User doesn't exist in this email")
    }

    const user = await UserModel.findOneAndUpdate({email},{ userName, profile, role, position, supervisor, hireDate})

    return user
}