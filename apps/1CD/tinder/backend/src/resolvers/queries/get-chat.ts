import { GraphQLError } from "graphql";
import { QueryResolvers } from "../../generated";
import { Messagemodel } from "../../models/tinderchat/message.model";
import { Chatmodel } from "../../models";
import { Context } from "../../types";


export const getChat:QueryResolvers['getChat']= async (_, {input}, {userId}:Context)=>{
    const user1= userId
    const user2 = input.user2
   try{
    const existingcChat = await Chatmodel.findOne({
        participants: { $all: [user1, user2] }})
    if(existingcChat){
        const chatId= existingcChat._id
        const chat = await Messagemodel.find({chatId})
        return chat
    }
        throw new GraphQLError(`Could not find chat`);
   }
   catch (error){
    throw new GraphQLError(`Error occured: ${error}`)
   }
}
