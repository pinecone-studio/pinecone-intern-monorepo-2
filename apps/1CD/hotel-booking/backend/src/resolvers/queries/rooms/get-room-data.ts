import { roomsModel } from 'src/models';
import { QueryResolvers } from '../../../generated';
 
export const getRooms: QueryResolvers['getRooms'] = async (_,variables) => {
  const {hotelId} = variables;
 
  const rooms = await roomsModel.find({hotelId});
 
  if(!rooms){
    throw new Error('Rooms not found');
  }
  return rooms;
};