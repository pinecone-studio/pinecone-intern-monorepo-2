import { QueryResolvers } from '../../../generated';
import { roomsModel } from '../../../models';
 
export const hotelService: QueryResolvers['hotelService'] = async (_,{roomId}) => {

  const orders = await roomsModel
    .find({
        _id: roomId
    })
 
  return orders;
};
 