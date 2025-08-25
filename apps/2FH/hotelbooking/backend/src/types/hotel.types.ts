import { Types } from 'mongoose';

export interface PlainHotel {
  _id: Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  stars: number;
  phone: string;
  rating: number;
  city: string;
  country: string;
  location: string;
  amenities: string[];
  languages: string[];
  policies: Array<{
    checkIn: string;
    checkOut: string;
    specialCheckInInstructions: string;
    accessMethods: string[];
    childrenAndExtraBeds: string;
    pets: string;
  }>;
  optionalExtras: Array<{
    youNeedToKnow: string;
    weShouldMention: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}
