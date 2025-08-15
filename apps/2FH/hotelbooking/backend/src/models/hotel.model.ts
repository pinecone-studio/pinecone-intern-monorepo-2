/* eslint-disable no-unused-vars */
import { Schema, model, models, Model } from 'mongoose';

type hotelType = {
  name: string;
  description: string;
  images: string[];
  stars: number;
  phone: string;
  rating: number;
  city: string;
  country: string;
  location: string;
  amenities: Amenity[];
  languages: string[];
  policies: policyType[];
  optionalExtras: optionalExtrasType[];
  faq: faqType[];
};

type policyType = {
  checkIn: string;
  checkOut: string;
  specialCheckInInstructions: string;
  accessMethods: string[];
  childrenAndExtraBeds: string;
  pets: string;
};

type optionalExtrasType = {
  youNeedToKnow: string;
  weShouldMention: string;
};

type faqType = {
  question: string;
  answer: string;
};

enum Amenity {
  POOL = 'pool',
  GYM = 'gym',
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  WIFI = 'wifi',
  PARKING = 'parking',
  FITNESS_CENTER = 'fitness_center',
  BUSINESS_CENTER = 'business_center',
  MEETING_ROOMS = 'meeting_rooms',
  CONFERENCE_ROOMS = 'conference_rooms',
  ROOM_SERVICE = 'room_service',
  AIR_CONDITIONING = 'air_conditioning',
  AIRPORT_TRANSFER = 'airport_transfer',
  FREE_WIFI = 'free_wifi',
  FREE_PARKING = 'free_parking',
  FREE_CANCELLATION = 'free_cancellation',
  SPA = 'spa',
  PETS_ALLOWED = 'pets_allowed',
  SMOKING_ALLOWED = 'smoking_allowed',
  LAUNDRY_FACILITIES = 'laundry_facilities',
}

const policySchema = new Schema({
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  specialCheckInInstructions: { type: String, required: true },
  accessMethods: { type: [String], required: true },
  childrenAndExtraBeds: { type: String, required: true },
  pets: { type: String, required: true },
});

const optionalExtrasSchema = new Schema({
  youNeedToKnow: { type: String, required: true },
  weShouldMention: { type: String, required: true },
});

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const hotelSchema = new Schema<hotelType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    stars: { type: Number, required: true },
    phone: { type: String, required: true },
    rating: { type: Number, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    location: { type: String, required: true },
    amenities: { type: [String], enum: Object.values(Amenity), required: true },
    languages: { type: [String], required: true },
    policies: { type: [policySchema], required: true },
    optionalExtras: { type: [optionalExtrasSchema], required: true },
    faq: { type: [faqSchema], required: true },
  },
  { timestamps: true }
);

export const HotelModel: Model<hotelType> = models['Hotel'] || model('Hotel', hotelSchema);
