import { QueryResolvers } from "src/generated";
import { RequestModel } from "src/models";

export const getRequests: QueryResolvers['getRequests'] = async (_, {email, startDate, endDate, status }) => {
    
    let query = {}
    if (email){
        query = {...query, email}
    }
    if(startDate){
        query = {...query, requestDate: {$gte: startDate, $lte: endDate}}
    }
    if(status){
        query = {...query, result: status}
    }
    const requests = await RequestModel.find(query)
    return requests
}