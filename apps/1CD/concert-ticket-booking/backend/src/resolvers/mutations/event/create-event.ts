import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';
import Ticket from '../../../models/tickets.model';

export const createEvent: MutationResolvers['createEvent'] = async (_, { input }) => {
  const newTickets = await Ticket.insertMany(input.dayTickets);
  const ticketIds = newTickets.map((item) => item._id);
  const scheduledDays = input.dayTickets.map((item) => item.scheduledDay);
  const newEvent = await Event.create({
    name: input.name,
    description: input.description,
    scheduledDays: scheduledDays,
    mainArtists: input.mainArtists,
    guestArtists: input.guestArtists,
    dayTickets: ticketIds,
    image: input.image,
    venue: input.venue,
    category: input.category,
  });

  return newEvent;
};
