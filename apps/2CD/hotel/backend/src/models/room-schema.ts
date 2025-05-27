// eslint-disable-next-line unicorn/filename-case
import mongoose from "mongoose";
 
const RoomSchema=new mongoose.Schema({
    roomNumber:{
        type:Number,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    roomImage:{
        type:[String],
        required:true
    },
    isAvailable:{
        type:String,
        enum:['BOOKED','AVAILABLE'],
        default:"AVAILABLE"
    },
    bedType:{
        type:String,
        enum:['King','Queen','Double','Single'],
        default:'Single'
    },
    numberOfBed:{
        type:String,
        enum:['1','2','3','4'],
        default:'1'
    },
    hotel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel',
        required:true
    },
    roomService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomService'
  }
 
})
export const Room = mongoose.model('Room', RoomSchema);