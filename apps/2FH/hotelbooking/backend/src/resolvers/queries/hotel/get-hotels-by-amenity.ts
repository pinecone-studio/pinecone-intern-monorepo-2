import { QueryResolvers } from 'src/generated';
import { HotelModel } from 'src/models';
import { mapAmenityToGraphQL, mapGraphQLToMongooseAmenity } from 'src/resolvers/common/amenities';

export const hotelsByAmenity: QueryResolvers['hotelsByAmenity'] = async (_, { amenity }) => {
  try {
    const mongooseAmenity = mapGraphQLToMongooseAmenity(amenity);

    const hotels = await HotelModel.find({
      amenities: mongooseAmenity,
    });

    return hotels.map((hotel) => {
      const hotelObj = hotel.toObject();
      return {
        ...hotelObj,
        id: hotelObj._id.toString(),
        amenities: hotelObj.amenities.map(mapAmenityToGraphQL),
        _id: undefined,
      };
    });
  } catch (error) {
    console.error('Failed to fetch hotels by amenity:', error);
    throw new Error('Failed to fetch hotels by amenity');
  }
};
