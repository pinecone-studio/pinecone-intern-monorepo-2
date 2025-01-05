import { paymentTickets } from '../../../../src/resolvers/mutations/order/payment-ticket';
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
  findOne: jest.fn(),
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

describe('payment-ticket mutation', () => {
  const mockOrder = {
    eventId: 'eventid12',
    ticketId: 'ticketid12',
    phoneNumber: '+976 90909090',
    email: 'example@email.com',
    ticketType: [
      {
        _id: '1122334455',
        soldQuantity: 3,
        totalQuantity: 10,
      },
    ],
    payment: 'pending',
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    (Ticket.findById as jest.Mock).mockClear();
    (Order.findOne as jest.Mock).mockClear();
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
    const mockFindOrder = { _id: 'orderid12345', ...mockOrder };
    (Order.findOne as jest.Mock).mockResolvedValueOnce(mockFindOrder);
    const mockUnitTicket = [{ _id: 'unitTicketId1' }, { _id: 'unitTicketId2' }, { _id: 'unitTicketId3' }];
    (UnitTicket.insertMany as jest.Mock).mockResolvedValueOnce(mockUnitTicket);

    const mockQrCodeDataUrl = 'data:image/png;base64,abc123';
    (qrCodes as jest.Mock).mockResolvedValueOnce(mockQrCodeDataUrl);

    await paymentTickets!({}, { orderId: 'orderid12345' }, { userId: null }, {} as GraphQLResolveInfo);

    expect(Ticket.findById).toHaveBeenCalledWith(mockOrder.ticketId);
    expect(Order.findOne).toHaveBeenCalledWith({ _id: 'orderid12345' });

    expect(UnitTicket.insertMany).toHaveBeenCalledWith([
      { productId: mockOrder.ticketId, ticketId: '1122334455', orderId: 'orderid12345', eventId: mockOrder.eventId },
      { productId: mockOrder.ticketId, ticketId: '1122334455', orderId: 'orderid12345', eventId: mockOrder.eventId },
      { productId: mockOrder.ticketId, ticketId: '1122334455', orderId: 'orderid12345', eventId: mockOrder.eventId },
    ]);
    expect(sendEmailWithQr).toHaveBeenCalledWith(mockOrder.email, mockQrCodeDataUrl);
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

    const mockOrder = {
      _id: 'orderid12345',
      ticketId: 'ticketid12',
      eventId: 'eventid12',
      email: 'example@email.com',
      ticketType: [
        {
          _id: '1122334455',
          soldQuantity: 299,
          totalQuantity: 300,
        },
      ],
      payment: 'pending', // This is critical to avoid throwing 'Already paid' error
    };

    (Ticket.findById as jest.Mock).mockResolvedValueOnce(mockTicket);
    (Order.findOne as jest.Mock).mockResolvedValueOnce(mockOrder);

    await expect(paymentTickets!({}, { orderId: 'orderid12345' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Seats are full');
  });

  it('should throw an error if order has already been paid', async () => {
    const paidOrder = { ...mockOrder, payment: 'paid' };
    (Order.findOne as jest.Mock).mockResolvedValueOnce(paidOrder);
    await expect(paymentTickets!({}, { orderId: 'orderid12345' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Already paid');
  });
  it('should throw an error if order not found', async () => {
    (Order.findOne as jest.Mock).mockResolvedValueOnce(null);
    await expect(paymentTickets!({}, { orderId: 'orderid12345' }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Order not found');
  });
});
