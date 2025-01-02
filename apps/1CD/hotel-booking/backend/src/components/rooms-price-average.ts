import { hotelsModel, roomsModel } from 'src/models';

export const roomsPriceAverage = async ({ _id }: { _id: string | undefined }) => {
  const rooms = await roomsModel.find({ hotelId: _id });
  let sum = 0;
  for (let i = 0; i < rooms.length; i++) {
    sum += rooms[i].price;
  }
  const roomsAveragePrice = Math.floor(sum / rooms.length);
  await hotelsModel.findByIdAndUpdate({ _id }, { roomsAveragePrice });
};
