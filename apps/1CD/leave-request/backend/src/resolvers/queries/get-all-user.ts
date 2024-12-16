import { QueryResolvers } from "src/generated"
import { UserModel } from "src/models"


export const getAllUsers : QueryResolvers['getAllUsers']= async (_) => {
    const users = await UserModel.find()
    return users
}

export const getAllSupervisors: QueryResolvers['getAllSupervisors'] = async (_) => {
    const users = await UserModel.find({role: 'supervisor'})
    return users
}