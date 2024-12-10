import { addToCarts } from "../../../../src/resolvers/mutations/order/add-to-cart";
import Order from "../../../../src/models/order.model";
import Ticket from "../../../../src/models/ticket.model";
import { GraphQLResolveInfo } from "graphql";

jest.mock('../../../../src/models/ticket.model', () => ({
  findById: jest.fn(),
}));

jest.mock('../../../../src/models/order.model', () => ({
  create: jest.fn(),
}));

describe('addToCarts mutation', () => {
  const userId = "2233445566";
  const input = {
    eventId: "eventid12",
    ticketId: "ticketid12",
    status: "available",
    orderNumber: 1,
    ticketType: [
      {
        _id: "1122334455",
        zoneName: "VIP",
        soldQuantity: 3,
        totalQuantity: 300,
        unitPrice: 90000,
        discount: 10,
        additional: "uuh ym unegei",
      },
    ],
  };

  beforeEach(() => {
    (Ticket.findById as jest.Mock).mockClear();
    (Order.create as jest.Mock).mockClear();
  });

  it('should order a ticket successfully', async () => {
    const mockOrder = {
      eventId: input.eventId,
      ticketId: input.ticketId,
      status: "available",
      orderNumber: 1,
      ticketType: [
        {
          _id: "1122334455",
          zoneName: 'VIP',
          soldQuantity: 3,
          totalQuantity: 300,
          unitPrice: 90000,
          discount: 10,
          additional: 'uuh ym unegei',
        },
      ],
      save: jest.fn().mockResolvedValue(true),
    };
    (Ticket.findById as jest.Mock).mockResolvedValueOnce(mockOrder);

    (Order.create as jest.Mock).mockResolvedValueOnce({ userId, ...input });


    const result = await addToCarts!({}, { input }, { userId }, {} as GraphQLResolveInfo);


    expect(Ticket.findById).toHaveBeenCalledWith(input.ticketId);
    expect(mockOrder.ticketType[0].soldQuantity).toBe(6); 
    expect(Order.create).toHaveBeenCalledWith({
      userId,
      eventId: input.eventId,
      ticketId: input.ticketId,
      status: "available",
      orderNumber: 1,
      ticketType: input.ticketType,
    });

    expect(result).toEqual({ userId, ...input });
  });

  it('should throw an error if seats are full', async () => {
    const mockOrder = {
      eventId: input.eventId,
      ticketId: input.ticketId,
      status: "available",
      orderNumber: 1,
      ticketType: [
        {
          _id: "1122334455",
          zoneName: 'VIP',
          soldQuantity: 299, 
          totalQuantity: 300,
          unitPrice: 90000,
          discount: 10,
          additional: 'uuh ym unegei',
        },
      ],
      save: jest.fn().mockResolvedValue(true),
    };

    (Ticket.findById as jest.Mock).mockResolvedValueOnce(mockOrder);

    await expect(addToCarts!({}, { input }, { userId }, {} as GraphQLResolveInfo))
      .rejects
      .toThrow('Seats are full');
  });
});
