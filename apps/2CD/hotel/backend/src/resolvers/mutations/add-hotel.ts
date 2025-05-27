import { Hotel } from '../../models/hotel';

export const addHotel = async (_: any, { input }: any) => {
  try {
    const newHotel = new Hotel({
      hotelName: input.hotelName,
      price: input.price,
      description: input.description,
      phoneNumber: input.phoneNumber,
      amenities: input.amenities || [],
      rooms: input.rooms || [],
      hotelStar: input.hotelStar,
      guestReviews: input.guestReviews || [],
      bookings: input.bookings || [],
      roomServices: input.roomServices || [],
    });

    const savedHotel = await newHotel.save();
    return savedHotel;
  } catch (error: any) {
    console.error('Error in addHotel mutation:', error);
    throw new Error('Failed to add hotel: ' + error.message);
  }
};
