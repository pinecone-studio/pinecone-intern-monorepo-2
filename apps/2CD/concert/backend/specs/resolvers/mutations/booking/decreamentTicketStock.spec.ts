import { decrementTicketStock } from 'src/utils/create-booking.ts/decrease-ticket-quantity';
import { ticketModel } from 'src/models';

jest.mock('src/models', () => ({
  ticketModel: {
    findById: jest.fn(),
  },
}));

describe('decrementTicketStock', () => {
  const mockTicketId = '507f191e810c19729de860ec';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if ticket is not found', async () => {
    (ticketModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(decrementTicketStock(mockTicketId, 1)).rejects.toThrow('Ticket ID not found.');
  });

  it('should throw an error if not enough tickets are available', async () => {
    const mockTicket = {
      quantity: 2,
    };

    (ticketModel.findById as jest.Mock).mockResolvedValue(mockTicket);

    await expect(decrementTicketStock(mockTicketId, 3)).rejects.toThrow('Not enough tickets available');
  });

  it('should decrement ticket quantity and save when enough stock is available', async () => {
    const mockSave = jest.fn();
    const mockTicket = {
      quantity: 5,
      save: mockSave,
    };

    (ticketModel.findById as jest.Mock).mockResolvedValue(mockTicket);

    await decrementTicketStock(mockTicketId, 3);

    expect(mockTicket.quantity).toBe(2);
    expect(mockSave).toHaveBeenCalled();
  });
});
