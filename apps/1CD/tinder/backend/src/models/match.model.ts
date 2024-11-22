import { model, models, Schema } from "mongoose";

export type MatchType={
    _id:string,
    user1Id:string,
    user2Id:string,
    createdAt:Date,

}

const matchSchema=new Schema<MatchType>({
    user1Id:{
        type:String,
        required:true,
    },
    user2Id:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true,
    }
})

export const matchModel=models['match'] || model('match', matchSchema);