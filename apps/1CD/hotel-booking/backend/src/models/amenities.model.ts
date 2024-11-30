import { Schema, model, models } from 'mongoose';

export type AmenitiesType = {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const amenitiesSchema = new Schema<AmenitiesType>({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const amenitiesModel = models['amenities'] || model('amenities', amenitiesSchema);

export type HotelAmenitiesType = {
  _id: string;
  hotelId: string;
  amenityId: string;
  createdAt: Date;
  updatedAt: Date;
};

const hotelAmenitiesSchema = new Schema<HotelAmenitiesType>({
  hotelId: {
    type: String,
    required: true,
  },
  amenityId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const hotelAmenitiesModel = models['hotel-amenities'] || model('hotel-amenities', hotelAmenitiesSchema);
