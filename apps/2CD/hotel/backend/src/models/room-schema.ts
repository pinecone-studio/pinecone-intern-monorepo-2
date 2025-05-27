// eslint-disable-next-line unicorn/filename-case
import mongoose from "mongoose";
 
const RoomSchema=new mongoose.Schema({
    roomNumber:{
        type:Number,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    roomImage:{
        type:[String],
        require:true
    },
    isAvailable:{
        enum:['BOOKED','AVAILABLE'],
        default:"AVAILABLE"
    },
    bedType:{
        enum:['King','Queen','Double','Single'],
        default:'Single'
    },
    numberOfBed:{
        enum:['1','2','3','4'],
        default:'1'
    },
    hotel:{
 
    },
    roomService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomService'
  }
 
})
export const Room = mongoose.model('Room', RoomSchema);