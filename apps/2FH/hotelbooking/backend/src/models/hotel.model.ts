import { Schema, model, models, Model } from 'mongoose';

type hotelType = {
  name: string;
  description: string;
  images: string;
  stars: number;
  phone: string;
  rating: number;
  city: string;
  country: string;
  location: string;
  languages: string[];
  policies: policyType[];
  optianalExtras: optianalExtrasType[];
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

type optianalExtrasType = {
  youNeedToKnow: string;
  weShouldMention: string;
};

type faqType = {
  question: string;
  answer: string;
};

const policySchema = new Schema({
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  specialCheckInInstructions: { type: String, required: true },
  accessMethods: { type: [String], required: true },
  childrenAndExtraBeds: { type: String, required: true },
  pets: { type: String, required: true },
});

const optianalExtrasSchema = new Schema({
  youNeedToKnow: { type: String, required: true },
  weShouldMention: { type: String, required: true },
});

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const hotelSchema = new Schema<hotelType>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: String, required: true },
  stars: { type: Number, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  location: { type: String, required: true },
  languages: { type: [String], required: true },
  policies: { type: [policySchema], required: true },
  optianalExtras: { type: [optianalExtrasSchema], required: true },
  faq: { type: [faqSchema], required: true },
}, { timestamps: true });

export const HotelModel: Model<hotelType> = models['Hotel'] || model('Hotel', hotelSchema);
