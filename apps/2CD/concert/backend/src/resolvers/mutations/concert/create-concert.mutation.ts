import { MutationResolvers, Response } from 'src/generated';
import { concertModel, ticketModel } from 'src/models';
import { timeScheduleModel } from 'src/models/timeschedule.model';

export const createConcert: MutationResolvers['createConcert'] = async (_, { input }) => {
  const { title, description, artists, venueId, schedule, ticket, thumbnailUrl } = input;
  if (!title || !description) {
    throw new Error('missing input required');
  }
  const newConcert = await concertModel.create({
    title,
    description,
    artists,
    venue: venueId,
    thumbnailUrl,
  });
  if (!newConcert) {
    throw new Error('concertModel.create fails.');
  }
  const schedules = schedule.map((s) => ({
    endDate: s.endDate,
    startDate: s.startDate,
    concert: newConcert._id,
    venue: venueId,
  }));
  const tickets = ticket.map((ti) => ({
    concert: newConcert._id,
    price: ti.price,
    type: ti.type,
    quantity: ti.quantity,
  }));
  await timeScheduleModel.insertMany(schedules);
  await ticketModel.insertMany(tickets);

  return Response.Success;
};
