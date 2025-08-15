import { QueryResolvers } from 'src/generated';
import { HotelModel } from 'src/models';
import { mapAmenityToGraphQL } from 'src/resolvers/common/amenities';

export const hotelsByStars: QueryResolvers['hotelsByStars'] = async (_, { stars }) => {
  try {
    const hotels = await HotelModel.find({ stars: { $gte: stars } })
      .sort({ stars: -1 })
      .lean()
      .exec();

    return hotels.map((hotelObj: any) => {
      const { _id, amenities = [], ...rest } = hotelObj;
      return {
        ...rest,
        id: _id.toString(),
        amenities: amenities.map(mapAmenityToGraphQL),
      };
    });
  } catch (error) {
    console.error('Failed to fetch hotels by stars:', error);
    throw new Error('Failed to fetch hotels by stars');
  }
};
