import { model, models, Schema } from 'mongoose';
export type Messagetype = {
  _id: string;
  chatId: string;
  content: string;
  senderId:string,
  createdAt: Date
};

const Messageschema =new Schema <Messagetype>({
    _id: {
        type:String, 
        required:true
    }, 
    chatId:{
        type: String,
        required:true
    },
    content:{
        type: String,
        required:true
    }, 
    senderId:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date, 
        default:Date.now,
        required:true
    }
})
export const Messagemodel = models ['message'] || model ('message', Messageschema)
