import { GraphQLError } from 'graphql';
import { MutationResolvers } from 'src/generated';
import { HotelModel } from 'src/models';

export const deleteHotel: MutationResolvers['deleteHotel'] = async (_, { hotelId }, _context) => {
  try {
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return {
        success: false,
        message: 'Hotel not found',
      };
    }

    const deletedHotel = await HotelModel.findByIdAndDelete(hotelId);
    if (!deletedHotel) {
      return {
        success: false,
        message: 'Failed to delete hotel',
      };
    }

    return {
      success: true,
      message: 'Hotel deleted successfully',
    };
  } catch (error) {
    console.error('Failed to delete hotel:', error);
    throw new GraphQLError('Failed to delete hotel', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
};
