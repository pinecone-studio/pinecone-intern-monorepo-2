import { QueryResolvers } from 'src/generated';
import { HotelModel } from 'src/models';
import { mapAmenityToGraphQL } from 'src/resolvers/common/amenities';

export const hotelsByCity: QueryResolvers['hotelsByCity'] = async (_, { city }) => {
  try {
    const hotels = await HotelModel.find({
      city: { $regex: new RegExp(city, 'i') },
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
    console.error('Failed to fetch hotels by city:', error);
    throw new Error('Failed to fetch hotels by city');
  }
};
