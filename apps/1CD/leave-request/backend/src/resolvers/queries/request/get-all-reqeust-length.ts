import { QueryResolvers } from "src/generated";
import { RequestModel } from "src/models";

export const getAllRequestLength: QueryResolvers['getAllRequestLength'] = async(_, {supervisorEmail,email}) => {
    const query: any = {}
    if(supervisorEmail){
        query.supervisorEmail = supervisorEmail;
    }
    if(email){
        query.email = email;
    }
    const res = (await RequestModel.find(query)).length
    return {res}
}