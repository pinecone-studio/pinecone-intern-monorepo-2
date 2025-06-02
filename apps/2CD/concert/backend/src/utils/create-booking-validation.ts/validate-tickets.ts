import { ticketModel } from '../../models/ticket.model';

export const validateTickets = async (ticketIds: string[]) => {
  const tickets = await ticketModel.find({ _id: { $in: ticketIds } });
  if (tickets.length !== ticketIds.length) {
    throw new Error('One or more tickets not found');
  }
};