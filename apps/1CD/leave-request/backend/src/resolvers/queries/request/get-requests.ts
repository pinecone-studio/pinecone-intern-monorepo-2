import { QueryResolvers } from "src/generated"
import { RequestModel } from "src/models"


export const getAllRequestsBySupervisor : QueryResolvers['getAllRequestsBySupervisor']= async (_,{supervisorEmail}) => {
    const requests = RequestModel.find({supervisorEmail})
    return requests
}

