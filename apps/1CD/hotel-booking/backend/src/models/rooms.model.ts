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
  roomService: string[];
  rating: number;
  starsRating: number;
  createdAt: Date;
};

const roomsSchema = new Schema<RoomsType>({
  roomType: {
    type: String,
    required: true,
  },

  roomCount: {
    type: Number,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  images: [String],
  price: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
  },

  roomService: [
    {
      type: String,
    },
  ],
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
