import { Schema, model, models } from 'mongoose';

export type HotelsType = {
  _id: string;
  hotelName: string;
  description?: string;
  starRating: number;
  phoneNumber: number;
  userRating: number;
  hotelAmenities: string[];
  images: string[];
  location: string;
  city: string;

  createdAt: Date;
};

const hotelsSchema = new Schema<HotelsType>({
  hotelName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
  starRating: {
    type: Number,
  },
  phoneNumber: Number,
  userRating: {
    type: Number,
  },
  hotelAmenities: [{ type: String }],
  images: [{ type: String }],
  location: {
    type: String,
  },
  city: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export type HotelsPopulatedType = Omit<HotelsType, 'hotels'> & {
  hotels: HotelsType;
};

export const hotelsModel = models['hotels'] || model('hotels', hotelsSchema);
