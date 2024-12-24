import { QueryResolvers } from "src/generated"
import { RequestModel } from "src/models"


export const getRequestById : QueryResolvers['getRequestById']= async (_,{_id}) => {
    const request = RequestModel.findOne({_id})
    return request
}

