import { Schema, model, models } from 'mongoose';

export type RoomsType = {
  id: string;
  hotelId: string;
  roomType: string;
  roomCount: number;
  roomNumber: string;
  images: string[];
  amenities: string[];
  price: number;
  roomService: {
    bathroom: [];
    accessability: [];
    entertaiment: [];
    foodDrink: [];
    other: [];
    bedroom:[]
  };

  rating: number;
  starsRating: number;
  createdAt: Date;
};

const roomsSchema = new Schema<RoomsType>({
  roomType: {
    type: String,
  },

  roomCount: {
    type: Number,
  },
  roomNumber: {
    type: String,
  },
  images: [String],
  price: {
    type: Number,
  },
  amenities: {
    type: [String],
  },

  roomService: {
    bathroom: [String],
    accessability: [String],
    entertaiment: [String],
    foodDrink: [String],
    other: [String],
    bedroom:[String]
  },

  rating: {
    type: Number,
  },
  starsRating: {
    type: Number,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const roomsModel = models['rooms'] || model('rooms', roomsSchema);
