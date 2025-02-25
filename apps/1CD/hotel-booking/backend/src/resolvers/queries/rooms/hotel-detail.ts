import { bookingModel, roomsModel } from 'src/models';
import { BookingStatus, QueryResolvers, RoomsFilterInput } from '../../../generated';
import { FilterType } from './filter-types';

export const hotelDetail: QueryResolvers['hotelDetail'] = async (_, variables) => {
  const { hotelId, input } = variables;
  const filterRoom = {};
  if (input) {
    await filterDate({ filterRoom, input });
    filterRoomType({ filterRoom, input });
  }
  const rooms = await roomsModel.find({ hotelId, ...filterRoom });

  return rooms;
};

const filterDate = async ({ filterRoom, input }: { filterRoom: FilterType; input: RoomsFilterInput }) => {
  const { checkInDate, checkOutDate } = input;
  let booked = [];
  if (checkInDate && checkOutDate) {
    booked = await bookingModel.find({
      $or: [
        {
          status: BookingStatus.Completed,
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
        {
          status: BookingStatus.Booked,
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
      ],
    });
  }

  if (!booked.length) return;

  const bookedRoomIds = booked.map((booking) => booking.roomId);

  filterRoom._id = {
    $nin: bookedRoomIds,
  };
};

const filterRoomType = ({ filterRoom, input }: { filterRoom: FilterType; input: RoomsFilterInput }) => {
  const { roomType } = input;
  if (!roomType) return;
  filterRoom.roomType = roomType;
};
