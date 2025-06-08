import { ticketModel } from "src/models";

export const decrementTicketStock = async (ticketId: string, bookingQuantity: number) => {
  const ticket = await ticketModel.findById(ticketId);

  if (!ticket) {
    throw new Error("Ticket ID not found.");
  }

  if (ticket.quantity < bookingQuantity) {
    throw new Error("Not enough tickets available");
  }

  ticket.quantity -= bookingQuantity;
  await ticket.save();
};
