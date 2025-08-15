import { GraphQLError } from 'graphql';
import { MutationResolvers } from 'src/generated';
import { HotelModel } from 'src/models';
import { mapGraphQLToMongooseAmenity } from 'src/resolvers/common/amenities';

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
