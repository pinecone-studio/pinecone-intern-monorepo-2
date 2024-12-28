import { addToCarts } from '../../../../src/resolvers/mutations/order/add-to-cart';
import Order from '../../../../src/models/order.model';
import Ticket from '../../../../src/models/ticket.model';
import UnitTicket from '../../../../src/models/unit-ticket.model';
import { qrCodes } from '../../../../src/utils/generate-qr';
import { sendEmailWithQr } from '../../../../src/utils/sent-to-qr';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/ticket.model', () => ({
  findById: jest.fn(),
}));

jest.mock('../../../../src/models/order.model', () => ({
  create: jest.fn(),
}));

jest.mock('../../../../src/models/unit-ticket.model', () => ({
  insertMany: jest.fn(),
}));

jest.mock('../../../../src/utils/generate-qr', () => ({
  qrCodes: jest.fn(),
}));

jest.mock('../../../../src/utils/sent-to-qr', () => ({
  sendEmailWithQr: jest.fn(),
}));

describe('addToCarts mutation', () => {
  const userId = '2233445566';
  const input = {
    eventId: 'eventid12',
    ticketId: 'ticketid12',
    phoneNumber: '+976 90909090',
    email: 'example@email.com',
    ticketType: [
      {
        _id: '1122334455',
        buyQuantity: '3',
      },
    ],
  };

  beforeEach(() => {
    (Ticket.findById as jest.Mock).mockClear();
    (Order.create as jest.Mock).mockClear();
    (UnitTicket.insertMany as jest.Mock).mockClear();
    (qrCodes as jest.Mock).mockClear();
    (sendEmailWithQr as jest.Mock).mockClear();
  });

  it('should order a ticket successfully and update soldQuantity', async () => {
    const mockTicket = {
      _id: 'ticketid12',
      ticketType: [
        {
          _id: '1122334455',
          soldQuantity: 3,
          totalQuantity: 10,
        },
      ],
      save: jest.fn().mockResolvedValue(true),
    };

    (Ticket.findById as jest.Mock).mockResolvedValueOnce(mockTicket);

    // Simulate the creation of an order, which includes the _id (orderId)
    const mockCreateOrder = { _id: 'orderid12345', userId, ...input };
    (Order.create as jest.Mock).mockResolvedValueOnce(mockCreateOrder);

    const mockUnitTicket = [{ _id: 'unitTicketId1' }, { _id: 'unitTicketId2' }, { _id: 'unitTicketId3' }];
    // Update this to check that insertMany gets the correct orderId
    (UnitTicket.insertMany as jest.Mock).mockResolvedValueOnce(mockUnitTicket);

    const mockQrCodeDataUrl = 'data:image/png;base64,abc123';
    (qrCodes as jest.Mock).mockResolvedValueOnce(mockQrCodeDataUrl);

    await addToCarts!({}, { input }, { userId }, {} as GraphQLResolveInfo);

    // Verifying that Ticket.findById is called
    expect(Ticket.findById).toHaveBeenCalledWith(input.ticketId);

    // Verifying that Order.create is called with the correct parameters
    expect(Order.create).toHaveBeenCalledWith({
      userId,
      eventId: input.eventId,
      ticketId: input.ticketId,
      phoneNumber: input.phoneNumber,
      email: input.email,
      ticketType: [
        {
          _id: '1122334455',
          soldQuantity: '3',
          totalQuantity: 10,
        },
      ],
    });

    expect(UnitTicket.insertMany).toHaveBeenCalledWith([
      {
        productId: 'ticketid12',
        ticketId: '1122334455',
        orderId: 'orderid12345',
        eventId: input.eventId,
      },
      {
        productId: 'ticketid12',
        ticketId: '1122334455',
        orderId: 'orderid12345',
        eventId: input.eventId,
      },
      {
        productId: 'ticketid12',
        ticketId: '1122334455',
        orderId: 'orderid12345',
        eventId: input.eventId,
      },
    ]);
    expect(sendEmailWithQr).toHaveBeenCalledWith(input.email, mockQrCodeDataUrl);
  });

  it('should throw an error if seats are full', async () => {
    const mockTicket = {
      _id: 'ticketid12',
      ticketType: [
        {
          _id: '1122334455',
          soldQuantity: 299,
          totalQuantity: 300,
        },
      ],
      save: jest.fn().mockResolvedValue(true),
    };
    (Ticket.findById as jest.Mock).mockResolvedValueOnce(mockTicket);
    await expect(addToCarts!({}, { input }, { userId }, {} as GraphQLResolveInfo)).rejects.toThrow('Seats are full');
  });

  it('should throw an Unauthorized error if no userId is provided', async () => {
    await expect(addToCarts!({}, { input }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });
});
