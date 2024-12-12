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
export const getRooms = async (_: unknown, { input }: { input: RoomFilterType }) => {
  try {
    const filter = {};
    await filterStar({ input, filter });
    await filterDate({ filter, input });
    const rooms = await roomsModel.find(filter).populate('hotelId');
    return rooms;
  } catch (err) {
    throw new Error((err as Error).message);
  }
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

const filterStar = async ({ filter, input }: { filter: FilterType; input: RoomFilterType }) => {
  const { starRating } = input;
  let matchHotels = [];

  if (starRating) {
    matchHotels = await hotelsModel.find({ starRating });
  }

  if (!matchHotels.length) return;

  matchHotels = matchHotels.map((hotel) => hotel._id);

  filter.hotelId = {
    $in: matchHotels,
  };
};
