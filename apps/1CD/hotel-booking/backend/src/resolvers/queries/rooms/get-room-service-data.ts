import { QueryResolvers } from '../../../generated';
import { roomsModel } from '../../../models';
 
export const getRoomServiceData: QueryResolvers['getRoomServiceData'] = async () => {
  
  const orders = await roomsModel
    .find({
        _id: roomsModel
    })
 
  return orders;
};
 