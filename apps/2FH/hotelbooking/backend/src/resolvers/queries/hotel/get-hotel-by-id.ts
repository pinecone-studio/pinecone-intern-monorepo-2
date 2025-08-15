import { GraphQLError } from 'graphql';
import { QueryResolvers } from 'src/generated';
import { HotelModel } from 'src/models';
import { mapAmenityToGraphQL } from 'src/resolvers/common/amenities';

export const hotel: QueryResolvers['hotel'] = async (_, { id }) => {
  try {
    const hotel = await HotelModel.findById(id);

    if (!hotel) {
      throw new GraphQLError('Hotel not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const hotelObj = hotel.toObject();
    return {
      ...hotelObj,
      id: hotelObj._id.toString(),
      amenities: hotelObj.amenities.map(mapAmenityToGraphQL),
      _id: undefined,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    console.error('Failed to fetch hotel:', error);
    throw new GraphQLError('Failed to fetch hotel', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
};
