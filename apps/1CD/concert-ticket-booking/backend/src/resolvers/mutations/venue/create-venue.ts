import { MutationResolvers } from '../../../generated';
import Venue from '../../../models/venue.model';

export const createArena: MutationResolvers['createArena'] = async (_, { input }) => {
  const { name, location, image, capacity, size } = input;
  const createVenue = await Venue.create({
    name: name,
    location: location,
    image: image,
    capacity: capacity,
    size: size,
  });

  return createVenue;
};
