import{model, models, Schema} from 'mongoose'

export type Chatmodel = {
    participants:[string],
    createdAt: Date
}
const Chatschema= new Schema<Chatmodel>({
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