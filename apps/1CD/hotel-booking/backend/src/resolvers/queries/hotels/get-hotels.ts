import { BookingType, HotelFilterInput, QueryResolvers } from 'src/generated';
import { bookingModel, hotelsModel, roomsModel, RoomsType } from 'src/models';
type FilterType = {
  _id?: {
    $not: {
      $in: string[];
    };
  };
};
export const getHotels: QueryResolvers['getHotels'] = async (_, { input }) => {
  const filter: FilterType = {};
  fitlerDate({ input, filter });

  const hotels = await hotelsModel.find(filter);
  if (!hotels.length) {
    throw new Error('Hotels not found');
  }
  console.log(hotels.length);
  return hotels;
};

const fitlerDate = async ({ input, filter }: { input: HotelFilterInput; filter: FilterType }) => {
  const { checkInDate, checkOutDate } = input;

  let notBookingOpportunities: BookingType[] = [];

  if (checkInDate && checkOutDate) {
    notBookingOpportunities = await bookingModel.find({
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate },
    });
  }

  if (!notBookingOpportunities?.length) return '';
  const notOpportunityRooms = await Promise.all(
    notBookingOpportunities.map((notBookingOpportunity) => {
      return roomsModel.findById({ _id: notBookingOpportunity.roomId });
    })
  );
  console.log(notOpportunityRooms);

  const ids = Ids({ notOpportunityRooms });

  // notBookingOpportunities.map(async (notBookingOportunity) => await roomsModel.findById({ _id: notBookingOportunity.roomId }));
  const opportunityRooms = await roomsModel.find({
    _id: {
      $not: {
        $in: ids,
      },
    },
  });
  console.log(opportunityRooms);
  console.log(opportunityRooms.length, 'length');
  console.log(opportunityRooms.includes(notBookingOpportunities));
  const hotelIds = FilterDate({ opportunityRooms });
  filter._id = {
    $not: {
      $in: hotelIds,
    },
  };
};

const FilterDate = ({ opportunityRooms }: { opportunityRooms: RoomsType[] }) => {
  const result: string[] = [];
  for (let i = 0; i < opportunityRooms.length; i++) {
    if (!result.includes(opportunityRooms[i]._id)) result.push(opportunityRooms[i]._id);
  }
  return result;
};

const Ids = ({ notOpportunityRooms }: { notOpportunityRooms: RoomsType[] }) => {
  const result = [];
  for (let i = 0; i < notOpportunityRooms.length; i++) {
    result.push(notOpportunityRooms[i]._id);
  }
  return result;
};
