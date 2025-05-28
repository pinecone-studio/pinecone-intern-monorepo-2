import { MutationResolvers, Response } from 'src/generated';
import { ArtistModel, concertModel, ticketModel, venueModel } from 'src/models';
import { timeScheduleModel } from 'src/models/timeschedule.model';
import { concertSchema } from 'src/zodSchemas';

export const createConcert: MutationResolvers['createConcert'] = async (_, { input }) => {
  const data = concertSchema.parse(input);
  const { title, description, artists, venueId, schedule, ticket, thumbnailUrl } = data;
  const venue = await venueModel.findById({
    _id: venueId,
  });
  if (!venue) {
    throw new Error('venue not found');
  }

  const existSchedule = await timeScheduleModel.find({
    $or: schedule.map(({ startDate, endDate }) => ({
      startDate: { $lt: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
      venue: venue._id,
    })),
  });
  if (existSchedule.length > 0) {
    throw new Error('Schedule already exists');
  }
  const artistsModel = await ArtistModel.find({
    _id: { $in: artists },
  });
  if (artists.length !== artistsModel.length) {
    throw new Error('One or more artists not found');
  }
  const newConcert = await concertModel.create({
    title,
    description,
    artists,
    venue: venue._id,
    thumbnailUrl,
  });

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
