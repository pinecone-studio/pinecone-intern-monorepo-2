import { createTicket } from '../../../src/resolvers/mutations';
import Ticket from '../../../src/models/ticket.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../src/models/ticket.model', () => ({
  create: jest.fn(),
}));

describe('createTicket', () => {
  it('should create a new ticket successfully', async () => {
    const input = [
      {
        zoneName: 'VIP',
        soldQuantity: 10,
        totalQuantity: 100,
        unitPrice: 50.0,
        discount: 5.0,
        additional: 'Extra perks',
      },
    ];
    const scheduledDay = new Date();

    (Ticket.create as jest.Mock).mockResolvedValue({ ...input, scheduledDay });

    const response = await createTicket!(
      {},
      { input: [{ zoneName: 'VIP', soldQuantity: 10, totalQuantity: 100, unitPrice: 50.0, discount: 5.0, additional: 'Extra perks' }], scheduledDay },
      { userId: null },
      {} as GraphQLResolveInfo
    );

    expect(response).toEqual({ ...input, scheduledDay });
    expect(Ticket.create).toHaveBeenCalledWith({
      scheduledDay: scheduledDay,
      ticketType: input,
    });
    expect(Ticket.create).toHaveBeenCalledTimes(1);
  });
});
