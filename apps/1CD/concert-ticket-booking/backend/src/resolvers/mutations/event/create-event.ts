import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';
import Ticket from '../../../models/ticket.model';
import { combineDateAndTime } from '../../../utils/generate-date';

export const createEvent: MutationResolvers['createEvent'] = async (_, { input }) => {
  const { dateRange, time, ticketType } = input;
  const days = combineDateAndTime(dateRange, time);
  const products = days.map((scheduledDay) => ({ scheduledDay, ticketType }));
  const newTickets = await Ticket.insertMany(products);
  const ticketIds = newTickets.map((item) => item._id);
  await Event.create({
    name: input.name,
    description: input.description,
    scheduledDays: days,
    mainArtists: input.mainArtists,
    guestArtists: input.guestArtists,
    products: ticketIds,
    image: input.image,
    venue: input.venue,
    category: input.category,
  });

  return {
    message: 'success',
  };
};
