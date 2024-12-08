import { MutationResolvers, MyTicketTypeInput } from "../../../generated"; 
import Order from "../../../models/order.model";
import Ticket from "../../../models/ticket.model"; 

    export const addToCarts: MutationResolvers['addToCarts'] = async (_, { input }, { userId }) => {
         const { ticketId, ticketType } = input; 
         const findTicket = await Ticket.findById(ticketId); 
         console.log("input", input.ticketType);
         if (findTicket) { 
            ticketType.forEach(({ _id, soldQuantity }) => { 
            
            const ticketIdx = findTicket.ticketType.findIndex( (item: MyTicketTypeInput) => item._id.toString() === _id.toString() ); 
            
            if (ticketIdx > -1) { 
                if(findTicket.ticketType[ticketIdx].soldQuantity + soldQuantity < findTicket.ticketType[ticketIdx].totalQuantity){ findTicket.ticketType[ticketIdx].soldQuantity += soldQuantity; 

                }else { 
                    throw new Error('Seats are full'); 
                } 
            } 
        }); 
    } 
   const saved = await findTicket.save(); 
   console.log("saved", saved);
    const createOrder = await Order.create({ userId, ...input, 

    }); 
    return createOrder 
};
