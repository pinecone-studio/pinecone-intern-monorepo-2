import { model, models, Schema } from "mongoose"

export type SwipeType={
    _id:string,
    swiperUserId:string,
    swipedUserId:string,
    status:string,
    createdAt:Date,
}


const swipeSchema=new Schema<SwipeType>({
    swiperUserId:{
        type:String,
        required:true,
    },
    swipedUserId:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['rejected', 'interested'],
        rquired:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
    },
})

export const swipeModel=models['swipe'] || model('swipe', swipeSchema);