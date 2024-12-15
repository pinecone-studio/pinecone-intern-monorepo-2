import { RoomFilterType } from 'src/generated';
import { bookingModel, hotelsModel, roomsModel } from 'src/models';
type FilterType = {
  _id?: {
    $nin: string[];
  };
  hotelId?: {
    $in: string[];
  };
};
type HotelFilterType = {
  userRating?: number;
  starRating?: number;
  hotelAmenities?: {
    $in: string[];
  };
};
export const getRooms = async (_: unknown, { input }: { input: RoomFilterType }) => {
  const filter = {};
  let matchedHotels = [];
  if (input) {
    matchedHotels = await filterHotelInfo({ filter, input });
    await filterDate({ filter, input });
  }

  if (!matchedHotels.length) return [];
  const rooms = await roomsModel.find(filter).populate('hotelId');

  return rooms;
};

const filterDate = async ({ filter, input }: { filter: FilterType; input: RoomFilterType }) => {
  const { checkInDate, checkOutDate } = input;
  let booked = [];
  if (checkInDate && checkOutDate) {
    booked = await bookingModel.find({
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
    });
  }

  if (!booked.length) return;

  const bookedRoomIds = booked.map((booking) => booking.roomId);

  filter._id = {
    $nin: bookedRoomIds,
  };
};

const filterHotelInfo = async ({ filter, input }: { filter: FilterType; input: RoomFilterType }) => {
  const hotelFilter: HotelFilterType = {};
  const { starRating, userRating, hotelAmenities } = input;
  filterByAmenities({ hotelFilter, hotelAmenities });
  if (userRating) {
    hotelFilter.userRating = userRating;
  }
  if (starRating) {
    hotelFilter.starRating = starRating;
  }
  let matchHotels = [];

  matchHotels = await hotelsModel.find(hotelFilter);

  matchHotels = matchHotels.map((hotel) => hotel._id);

  filter.hotelId = {
    $in: matchHotels,
  };
  return matchHotels;
};
const filterByAmenities = ({ hotelFilter, hotelAmenities }: { hotelFilter: HotelFilterType; hotelAmenities: string[] | undefined }) => {
  if (hotelAmenities)
    if (hotelAmenities.length) {
      hotelFilter.hotelAmenities = {
        $in: hotelAmenities,
      };
    }
};
