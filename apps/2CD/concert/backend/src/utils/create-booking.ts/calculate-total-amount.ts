import { BookedTicket} from "src/generated";


export const calculateTotalAmount = (tickets:BookedTicket[]) => {
  const totalAmountForTickets = tickets.reduce((sum, bookedTicket) => {
    return sum + (bookedTicket.price * bookedTicket.quantity);
  }, 0);
  return totalAmountForTickets
};