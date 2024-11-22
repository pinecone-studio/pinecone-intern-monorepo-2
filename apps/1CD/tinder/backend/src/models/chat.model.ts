import { model, models, Schema } from "mongoose";

export type ChatType={
    _id:string,
    senderId:string,
    receiverId:string,
    content:string,
    createdAt:Date,
}

const chatSchema=new Schema<ChatType>({
    senderId:{
        type:String,
        required:true,
    },
    receiverId:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

export const chatModel=models['chat'] || model('chat', chatSchema);