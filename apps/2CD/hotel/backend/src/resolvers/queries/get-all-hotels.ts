import { Hotel } from '../../models/hotel';

export const getAllHotels = async () => {
  try {
    const hotels = await Hotel.find().exec(); 
    return hotels;
  } catch (error: any) {
    throw new Error('Failed to fetch hotels: ' + error.message);
  }
};
