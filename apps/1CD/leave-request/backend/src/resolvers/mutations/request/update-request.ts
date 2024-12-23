import { MutationResolvers } from "../../../generated";
import { RequestModel } from "../../../models";

export const updateRequest : MutationResolvers['updateRequest'] = async (_ : unknown, {_id, result, comment }) => {
    const findRequest = await RequestModel.findOne({_id})


    if(!findRequest){
        throw new Error("Request doesn't exist")
    }

    const updatedRequest = await RequestModel.findOneAndUpdate({_id},{ result, comment}, {new: true})

    return updatedRequest
}