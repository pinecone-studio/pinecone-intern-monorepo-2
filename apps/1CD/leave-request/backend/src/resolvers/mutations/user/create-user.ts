import { MutationResolvers } from "../../../generated";
import { UserModel } from "../../../models";

export const createUser : MutationResolvers['createUser'] = async (_ : unknown, {email, position, role, profile, userName, supervisor, hireDate}) => {

    const findUser = await UserModel.findOne({email})

    if(findUser){
        throw new Error("User exist in this email")
    }

    const user = await UserModel.create({email, userName, profile, role, position, supervisor, hireDate})

    return user
}