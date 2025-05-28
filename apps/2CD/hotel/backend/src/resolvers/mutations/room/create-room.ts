// import { Room } from "src/models";

// export const createRoom = async (_: any, { input }: any) => {
//   try {
//     const newRoom = new Room({
//       roomNumber: input.roomNumber,
//       price: input.price,
//       description: input.description,
//       roomImage: input.roomImage,
//       isAvailable: input.isAvailable,
//       bedType: input.bedType,
//       numberOfBed: input.numberOfBed,
//     });

//     const savedRoom = await newRoom.save();

//     return {
//   success: true,
//   message: "Room created successfully",
//   data: {
//     id: savedRoom._id.toString(),  
//     roomNumber: savedRoom.roomNumber,
//     price: savedRoom.price,
//     description: savedRoom.description,
//     roomImage: savedRoom.roomImage,
//     isAvailable: savedRoom.isAvailable,
//     bedType: savedRoom.bedType,
//     numberOfBed: savedRoom.numberOfBed,
//   },
// };
//   } catch (error: any) {
//     console.log(error);
//     return {
//       success: false,
//       message: error.message || "Failed to create room",
//       data: null,
//     };
//   }
// };