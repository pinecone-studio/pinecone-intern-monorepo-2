import { Hotel } from '@/types/hotel';
import { ApolloError } from '@apollo/client';

export const amenityDisplayMap: Record<string, string> = {
  FREE_WIFI: 'Free WiFi',
  WIFI: 'WiFi',
  FREE_PARKING: 'Free self parking',
  PARKING: 'Parking',
  SPA: 'Spa access',
  POOL: 'Pool',
  GYM: 'Gym',
  RESTAURANT: 'Restaurant',
  BAR: 'Bar',
  FITNESS_CENTER: 'Fitness Center',
  BUSINESS_CENTER: 'Business Center',
  ROOM_SERVICE: 'Room Service',
  AIR_CONDITIONING: 'Air Conditioning',
  AIRPORT_TRANSFER: 'Airport Transfer',
  FREE_CANCELLATION: 'Free Cancellation',
  PETS_ALLOWED: 'Pets Allowed',
  LAUNDRY_FACILITIES: 'Laundry Facilities',
};

export const getDisplayAmenity = (amenity: string): string => {
  return amenityDisplayMap[amenity] || amenity.toLowerCase().replace(/_/g, ' ');
};

export const getHotelRating = (hotel: Hotel): number => {
  return hotel.rating || hotel.stars || 3;
};

export const processHotelData = (hotelsData: any[]): Hotel[] => {
  return hotelsData.map((hotel, index) => ({
    ...hotel,
    image: hotel.images?.[0] || null,
    amenities: hotel.amenities.map(getDisplayAmenity),
    rating: getHotelRating(hotel),
    isPopular: index < 8,
    bookingCount: Math.floor(Math.random() * 100) + 50,
    price: Math.floor(Math.random() * 200) + 50,
  }));
};

export const convertApolloError = (error: ApolloError | undefined): Error | null => {
  if (!error) return null;
  return new Error(error.message);
};

export const formatGuestsText = (guests: { adults: number; children: number; rooms: number }): string => {
  const totalGuests = guests.adults + guests.children;
  return `${totalGuests} traveler${totalGuests !== 1 ? 's' : ''}, ${guests.rooms} room${guests.rooms !== 1 ? 's' : ''}`;
};
