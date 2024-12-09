import{model, models, Schema} from 'mongoose'

export type Chatmodel = {
    _id:String, 
    participants:[string],
    createdAt: Date
}
const Chatschema= new Schema<Chatmodel>({
    _id:{
        type:String,
        required:true
    },
    participants:{
        type:[String],
        required:true
    }, 
    createdAt:{
        type: Date, 
        default:Date.now,
        required:true
    }
})
export const Chatmodel = models ['chat'] || model ('chat', Chatschema)