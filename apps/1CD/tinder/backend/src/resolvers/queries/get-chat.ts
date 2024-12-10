import { GraphQLError } from "graphql";
import { QueryResolvers } from "../../generated";
import { Messagemodel } from "../../models/tinderchat/message.model";


export const getChat:QueryResolvers['getChat']= async (_, {input})=>{
    const chatId= input._id
    const chat = await Messagemodel.find({chatId})
    if(!chat){
        throw new GraphQLError(`Could not find chat`);
    }
    return chat
}