import { Schema, Types, model, models } from 'mongoose';

export type RoomsType = {
  _id: string;
  hotelId: Types.ObjectId;
  roomType: string;
  roomCount: number;
  roomNumber: string;
  roomInformation: string;
  images: string[];
  amenities: string[];
  roomName: string;
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
  hotelId: Schema.Types.ObjectId,
  roomInformation: String,
  roomName: String,

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

export type RoomsPopulatedType = Omit<RoomsType, 'rooms'> & {
  rooms: RoomsType;
};

export const roomsModel = models['rooms'] || model('rooms', roomsSchema);
