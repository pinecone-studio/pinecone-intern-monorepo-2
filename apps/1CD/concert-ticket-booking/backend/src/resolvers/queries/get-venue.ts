import { QueryResolvers } from '../../generated';
import Venue from '../../models/venue.model';

export const getArena: QueryResolvers['getArena'] = async () => {
  const getArena = await Venue.find({});
  return getArena;
};
