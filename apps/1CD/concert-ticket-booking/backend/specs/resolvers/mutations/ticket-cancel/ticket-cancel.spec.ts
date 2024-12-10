import { cancelTicket } from '../../../../src/resolvers/mutations/ticket-cancel';
import Order from '../../../../src/models/order.model';
import Ticket from '../../../../src/models/ticket.model';
import Request from '../../../../src/models/request.model';
import { GraphQLResolveInfo } from 'graphql';

jest.mock('../../../../src/models/order.model');
jest.mock('../../../../src/models/ticket.model');
jest.mock('../../../../src/models/request.model');

const bankDatas = {
  eventId: 'event123',
  bankAccount: '123456789',
  bankName: 'MockBank',
  accountOwner: 'MockOwner',
  phoneNumber: '1234567890',
  totalPrice: 100,
  orderId: 'order123',
};

describe('cancelTicket', () => {
  const userId = 'user123';
  const mockOrder = {
    _id: 'order123',
    createdAt: new Date(),
    ticketId: 'ticket123',
    ticketType: [{ _id: 'ticketType123', soldQuantity: 2 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not logged in', async () => {
    await expect(cancelTicket!({}, { input: { orderId: 'orderId', bankDatas: bankDatas } }, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('must be login');
  });

  it('should throw an error if order is not found', async () => {
    (Order.findById as jest.Mock).mockResolvedValue(null);

    await expect(cancelTicket!({}, { input: { orderId: 'order123', bankDatas: bankDatas } }, { userId }, {} as GraphQLResolveInfo)).rejects.toThrow('Order not found');
  });

  it('should throw an error if cancellation is after 24 hours', async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 2);
    (Order.findById as jest.Mock).mockResolvedValue({ ...mockOrder, createdAt: oldDate });

    await expect(cancelTicket!({}, { input: { orderId: 'order123', bankDatas: bankDatas } }, { userId }, {} as GraphQLResolveInfo)).rejects.toThrow('Cancellation not allowed after 24 hours');
  });

  it('should successfully cancel the ticket', async () => {
    (Order.findById as jest.Mock).mockResolvedValue(mockOrder);
    (Ticket.bulkWrite as jest.Mock).mockResolvedValue({});
    (Order.updateOne as jest.Mock).mockResolvedValue({});
    (Request.create as jest.Mock).mockResolvedValue({});

    const result = await cancelTicket!({}, { input: { orderId: 'order123', bankDatas } }, { userId }, {} as GraphQLResolveInfo);

    expect(result.message).toEqual('Ticket successfully canceled');
    expect(Order.findById).toHaveBeenCalledWith('order123');
    expect(Ticket.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { _id: 'ticket123', 'ticketType._id': 'ticketType123' },
          update: { $inc: { 'ticketType.$.soldQuantity': -2 } },
        },
      },
    ]);
    expect(Order.updateOne).toHaveBeenCalledWith({ _id: 'order123' }, { status: 'pending' });
    expect(Request.create).toHaveBeenCalledWith(bankDatas);
  });
});
