import { QueryResolvers } from 'src/generated';
import { hotelsModel } from 'src/models';

export const getHotels: QueryResolvers['getHotels'] = async () => {
  const hotels = await hotelsModel.find();
  if (!hotels.length) {
    throw new Error('Hotels not found');
  }
  return hotels;
};
