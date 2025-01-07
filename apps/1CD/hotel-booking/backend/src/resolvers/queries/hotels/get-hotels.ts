import { AdminHotelFilter, QueryResolvers } from 'src/generated';
import { hotelsModel, roomsModel } from 'src/models';
type AdminHotelsFilter = {
  hotelName?: { $regex: string; $options: string };
  starRating?: number;
  userRating?: {
    $gt: number;
  };
  _id?: { $in: string[] };
};
export const getHotels: QueryResolvers['getHotels'] = async (_: unknown, { input }) => {
  const filter: AdminHotelsFilter = {};

  if (input) {
    hotelFilters(filter, input);
    await filterByRoomType(filter, input);
  }
  const hotels = await hotelsModel.find(filter);

  return hotels;
};
const hotelFilters = (filter: AdminHotelsFilter, input: AdminHotelFilter) => {
  const { hotelName, userRating, starRating } = input;
  if (hotelName) {
    filter.hotelName = { $regex: hotelName, $options: 'i' };
  }
  if (starRating) {
    filter.starRating = starRating;
  }
  if (userRating) {
    filter.userRating = { $gt: userRating };
  }
};
const filterByRoomType = async (filter: AdminHotelsFilter, input: AdminHotelFilter) => {
  const { roomType } = input;
  if (!roomType) return;
  const rooms = await roomsModel.find({
    roomType,
  });
  const hotelsId = rooms.map((rooms) => rooms.hotelId);

  filter._id = { $in: hotelsId };
};
