import { Amenity } from '@/generated';

export interface Policy {
  checkIn: string;
  checkOut: string;
  specialCheckInInstructions: string;
  accessMethods: string[];
  childrenAndExtraBeds: string;
  pets: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface OptionalExtra {
  youNeedToKnow: string;
  weShouldMention: string;
}

export interface FormData {
  name: string;
  description: string;
  stars: number;
  phone: string;
  rating: number;
  city: string;
  country: string;
  location: string;
  languages: string[];
  amenities: Amenity[];
  policies: Policy[];
  optionalExtras: OptionalExtra[];
  faq: FaqItem[];
} 