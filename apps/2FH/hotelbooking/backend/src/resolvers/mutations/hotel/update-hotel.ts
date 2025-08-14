import { GraphQLError } from 'graphql';
import { MutationResolvers, UpdateHotelInput } from 'src/generated';
import { HotelModel } from 'src/models';

const mapGraphQLToMongooseAmenity = (amenity: string): string => {
  const mapping: Record<string, string> = {
    POOL: 'pool',
    GYM: 'gym',
    RESTAURANT: 'restaurant',
    BAR: 'bar',
    WIFI: 'wifi',
    PARKING: 'parking',
    FITNESS_CENTER: 'fitness_center',
    BUSINESS_CENTER: 'business_center',
    MEETING_ROOMS: 'meeting_rooms',
    CONFERENCE_ROOMS: 'conference_rooms',
    ROOM_SERVICE: 'room_service',
    AIR_CONDITIONING: 'air_conditioning',
    AIRPORT_TRANSFER: 'airport_transfer',
    FREE_WIFI: 'free_wifi',
    FREE_PARKING: 'free_parking',
    FREE_CANCELLATION: 'free_cancellation',
    SPA: 'spa',
    PETS_ALLOWED: 'pets_allowed',
    SMOKING_ALLOWED: 'smoking_allowed',
    LAUNDRY_FACILITIES: 'laundry_facilities',
  };
  return mapping[amenity] || amenity;
};

const handleUpdateError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  console.error('Failed to update hotel:', error);
  throw new GraphQLError('Failed to update hotel', {
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      http: {
        status: 500,
      },
    },
  });
};

const validateHotelExists = async (id: string) => {
  const existingHotel = await HotelModel.findById(id);
  if (!existingHotel) {
    throw new GraphQLError('Hotel not found', {
      extensions: {
        code: 'NOT_FOUND',
        http: {
          status: 404,
        },
      },
    });
  }
  return existingHotel;
};

const prepareUpdateData = (hotel: UpdateHotelInput) => {
  const updateData: Record<string, unknown> = { ...hotel };
  if (hotel.amenities) {
    updateData.amenities = hotel.amenities.map(mapGraphQLToMongooseAmenity);
  }
  return updateData;
};

export const updateHotel: MutationResolvers['updateHotel'] = async (_, { id, hotel }) => {
  try {
    await validateHotelExists(id);
    const updateData = prepareUpdateData(hotel);
    const updatedHotel = await HotelModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedHotel) {
      throw new GraphQLError('Failed to update hotel');
    }

    return {
      success: true,
      message: 'Hotel updated successfully',
    };
  } catch (error) {
    return handleUpdateError(error);
  }
};
