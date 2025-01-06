import { RoomFilterType } from 'src/generated';
import { bookingModel, hotelsModel, roomsModel } from 'src/models';
import { FilterType, HotelFilterType, SortType } from './filter-types';

export const getFilterByPropertiesHotels = async (_: unknown, { input }: { input: RoomFilterType }) => {
  const filter = {};

  const sort = {};

  if (input) {
    await filteredRoomsHotelIds({ input, filter });
    await filterHotelInfo({ filter, sort, input });
  }

  const hotels = await hotelsModel.find(filter).sort(sort);

  return hotels;
};

const filterDate = async ({ filterRoom, input }: { filterRoom: FilterType; input: RoomFilterType }) => {
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

  filterRoom._id = {
    $nin: bookedRoomIds,
  };
};
const filteredRoomsHotelIds = async ({ input, filter }: { input: RoomFilterType; filter: HotelFilterType }) => {
  const filterRoom = {};

  if (input) {
    filterDate({ filterRoom, input });
    filterByRoomType({ filterRoom, input });
  }
  const rooms = await roomsModel.find(filterRoom);
  const inHotelIds = rooms.map((room) => room.hotelId);
  filter._id = {
    $in: inHotelIds,
  };
};

const filterHotelInfo = async ({ filter, sort, input }: { filter: HotelFilterType; sort: SortType; input: RoomFilterType }) => {
  const { starRating, userRating, hotelAmenities, price, hotelName } = input;

  filterByAmenities({ filter, hotelAmenities });
  filterByHotelName({ filter, hotelName });
  if (price) {
    sort.roomsAveragePrice = price;
  }
  if (userRating) {
    filter.userRating = {
      $gt: userRating,
    };
  }

  if (starRating) {
    filter.starRating = starRating;
  }
};

const filterByAmenities = ({ filter, hotelAmenities }: { filter: HotelFilterType; hotelAmenities: string[] | undefined }) => {
  if (hotelAmenities)
    if (hotelAmenities.length) {
      filter.hotelAmenities = {
        $in: hotelAmenities,
      };
    }
};

const filterByHotelName = ({ filter, hotelName }: { filter: HotelFilterType; hotelName: string | undefined }) => {
  if (hotelName) {
    filter.hotelName = {
      $regex: hotelName,
      $options: 'i',
    };
  }
};

const filterByRoomType = ({ filterRoom, input }: { input: RoomFilterType; filterRoom: FilterType }) => {
  const { roomType } = input;
  if (roomType) {
    filterRoom.roomType = roomType;
  }
};
