import { GraphQLError } from 'graphql';
import { MutationResolvers } from 'src/generated';
import { HotelModel } from 'src/models';

const mapGraphQLToMongooseAmenity = (amenity: string): string => {
  const mapping: Record<string, string> = {
    'POOL': 'pool',
    'GYM': 'gym',
    'RESTAURANT': 'restaurant',
    'BAR': 'bar',
    'WIFI': 'wifi',
    'PARKING': 'parking',
    'FITNESS_CENTER': 'fitness_center',
    'BUSINESS_CENTER': 'business_center',
    'MEETING_ROOMS': 'meeting_rooms',
    'CONFERENCE_ROOMS': 'conference_rooms',
    'ROOM_SERVICE': 'room_service',
    'AIR_CONDITIONING': 'air_conditioning',
    'AIRPORT_TRANSFER': 'airport_transfer',
    'FREE_WIFI': 'free_wifi',
    'FREE_PARKING': 'free_parking',
    'FREE_CANCELLATION': 'free_cancellation',
    'SPA': 'spa',
    'PETS_ALLOWED': 'pets_allowed',
    'SMOKING_ALLOWED': 'smoking_allowed',
    'LAUNDRY_FACILITIES': 'laundry_facilities',
  };
  return mapping[amenity] || amenity;
};

export const createHotel: MutationResolvers['createHotel'] = async (_, { hotel }, _context) => {
  try {
    const hotelData = {
      ...hotel,
      amenities: hotel.amenities.map(mapGraphQLToMongooseAmenity),
    };

    const createdHotelDoc = await HotelModel.create(hotelData);
    if (!createdHotelDoc) {
      throw new GraphQLError('Failed to create hotel');
    }

    return {
      success: true,
      message: 'Hotel created successfully',
    };
  } catch (error) {
    console.error('Failed to create hotel:', error);
    throw new GraphQLError('Failed to create hotel', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
};
