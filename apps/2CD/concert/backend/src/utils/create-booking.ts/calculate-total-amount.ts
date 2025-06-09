import { BookedTicket } from "src/generated";
import { ticketModel } from "src/models";

export const calculateTotalAmount = async (tickets: BookedTicket[]) => {
  let totalAmount = 0;

  for (const bookedTicket of tickets) {
    const ticket = await ticketModel.findById(bookedTicket.ticketId);

    totalAmount += ticket.price * bookedTicket.quantity;
  }

  return totalAmount;
};
