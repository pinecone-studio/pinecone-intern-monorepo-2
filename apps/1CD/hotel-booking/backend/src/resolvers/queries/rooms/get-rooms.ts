import { RoomFilterType } from 'src/generated';
import { bookingModel, hotelsModel, roomsModel } from 'src/models';
type FilterType = {
  _id?: {
    $nin: string[];
  };
  hotelId?: {
    $in: string[];
  };
  price?: {
    $sort: { price: number };
  };
  roomType?: string;
};
type HotelFilterType = {
  userRating?: {
    $gt: number;
  };
  starRating?: number;
  hotelAmenities?: {
    $in: string[];
  };
  hotelName?: { $regex: string; $options: string };
};
type SortType = {
  price?: number;
  starRating?: number;
};
export const getRooms = async (_: unknown, { input }: { input: RoomFilterType }) => {
  const filter = {};
  const sort = {};
  let matchedHotels = [];

  if (input) {
    matchedHotels = await filterHotelInfo({ filter, input });
    await filterDate({ filter, input });
    filterByRoomType({ input, filter });
  }
  sortByRoomPrice({ input, sort });

  if (!matchedHotels.length) return [];
  const rooms = await roomsModel.find(filter).populate('hotelId').sort(sort);
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
  const { starRating, userRating, hotelAmenities, hotelName } = input;
  filterByAmenities({ hotelFilter, hotelAmenities });
  filterByHotelName({ hotelFilter, hotelName });
  if (userRating) {
    hotelFilter.userRating = {
      $gt: userRating,
    };
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

const filterByHotelName = ({ hotelFilter, hotelName }: { hotelFilter: HotelFilterType; hotelName: string | undefined }) => {
  if (hotelName) {
    hotelFilter.hotelName = {
      $regex: hotelName,
      $options: 'i',
    };
  }
};

const sortByRoomPrice = ({ input, sort }: { input: RoomFilterType; sort: SortType }) => {
  sort.starRating = -1;
  const { price } = input;
  if (price) {
    sort.price = price;
  }
};

const filterByRoomType = ({ input, filter }: { input: RoomFilterType; filter: FilterType }) => {
  const { roomType } = input;
  if (roomType) {
    filter.roomType = roomType;
  }
};
