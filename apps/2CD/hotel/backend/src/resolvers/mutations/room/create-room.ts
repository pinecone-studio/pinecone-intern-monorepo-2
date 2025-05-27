// import { Response } from "src/generated"
import { Room } from "src/models"


export const createRoom=async(_:any, {input}:any)=>{
  try {
    const newRoom=new Room({
      roomNumber:input.inputNumber,
      price: input.price,
      description: input.description,
      roomImage: input.roomImage,
      isAvailable: input.isAvailable,
      bedType: input.bedType,
      numberOfBed: input.numberOfBed
    })
const savedRoom=await newRoom.save();

    console.log(savedRoom);
    
  } catch (error) {
    console.log(error);
     return {
      success: false,
      message: "Failed to create room",
      data: null
    };
  }
    
}