
import { model, models, Schema } from "mongoose";


type SwipeType = {
    _id: string;
    swiperUser:string,
    swipedUser:string,
    type:string,
    createdAt: Date;
   
  };

const swipeSchema=new Schema<SwipeType>({
    swiperUser:{
        type:String,
        required:true,
    },
    swipedUser:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:['liked','disliked'],
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        required:true,
    },
   
});

export const swipeModel=models['swipe'] || model('swipe',swipeSchema);