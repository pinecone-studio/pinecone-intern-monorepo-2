//eslint-disable-next-line unicorn/filename-case
import mongoose from "mongoose";
 
const RoomServiceSchema=new mongoose.Schema({
    bathroom:{
        type:[String],
        require:true
    },
      accesibility:{
        type:[String],
        require:true
    },
    entertainment:{
        type:[String],
        require:true
    },
    foodAndDrink:{
        type:[String],
        require:true
    },
    bedroom:{
        type:[String],
        require:true
    },
})
export const RoomService=mongoose.model("RoomService",RoomServiceSchema)