/* eslint-disable no-unused-vars */
import mongoose ,{ Schema, Document } from "mongoose";

export enum RoomAvailabilityRole {
  BOOKED = 'BOOKED',
  AVAILABLE = 'AVAILABLE',
}

export enum BedType {
  KING = 'King',
  QUEEN = 'Queen',
  DOUBLE = 'Double',
  SINGLE = 'Single',
}

export interface IRoom extends Document {
  roomNumber: number;
  price: string;
  description: string;
  roomImage: string[];
  isAvailable: RoomAvailabilityRole;
  bedType: BedType;
  numberOfBed: number;
  hotel?: mongoose.Types.ObjectId;
  roomService:string[];
}

const RoomSchema: Schema = new Schema({
  roomNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  roomImage: {
    type: [String],
    required: true,
  },
  isAvailable: {
    type: String,
    enum: Object.values(RoomAvailabilityRole),
    default: RoomAvailabilityRole.AVAILABLE,
  },
  bedType: {
    type: String,
    enum: Object.values(BedType),
    default: BedType.SINGLE,
  },
  numberOfBed: {
    type: Number,
    enum: [1, 2, 3, 4],
    default: 1,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  roomService: {
      bathroom: {
        type: [String],
        required: true
    },
    accesibility: {
        type: [String],
        required: true
    },
    entertainment: {
        type: [String],
        required: true
    },
    foodAndDrink: {
        type: [String],
        required: true
    },
    bedroom: {
        type: [String],
        required: true
    },
  },
},
  { timestamps: true });

export const Room =mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
