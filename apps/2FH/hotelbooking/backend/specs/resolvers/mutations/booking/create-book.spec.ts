import { createBooking } from '../../../../src/resolvers/mutations/booking';
import { BookingModel } from '../../../../src/models/booking.model';
import { CreateBookingInput, RoomCustomerInput } from '../../../../src/generated';

jest.mock('../../../../src/models/booking.model');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;

describe('createBooking resolver (unit test)', () => {
  const roomCustomer: RoomCustomerInput = {
    firstName: 'Firstname',
    lastName: 'lastName',
    email: 'test@gmail.com',
    phoneNumber: '12345678',
  };

  const validInput: CreateBookingInput = {
    adults: 2,
    children: 1,
    checkInDate: '2030-02-01',
    checkOutDate: '2030-02-03',
    hotelId: 'hotel123',
    roomId: 'room123',
    userId: 'user123',
    roomCustomer: roomCustomer,
    status: 'Booked' as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a booking successfully', async () => {
    const mockBooking = { _id: 'mock-id', ...validInput, status: 'Booked' };
    mockBookingModel.create.mockResolvedValueOnce(mockBooking as any);

    const result = await createBooking({}, { input: validInput }, {}, {});

    expect(mockBookingModel.create);
    expect(result).toEqual(mockBooking);
  });

  it('should throw error if checkOutDate <= checkInDate', async () => {
    const invalidInput = {
      ...validInput,
      checkInDate: '2030-02-05',
      checkOutDate: '2030-02-01',
    };

    await expect(createBooking({}, { input: invalidInput }, {}, {})).rejects.toThrow('Check-out date must be after check-in date');
    expect(mockBookingModel.create).not.toHaveBeenCalled();
  });

  it('should throw error if checkInDate is in the past', async () => {
    const pastInput = {
      ...validInput,
      checkInDate: '2020-01-01',
      checkOutDate: '2020-01-02',
    };

    await expect(createBooking({}, { input: pastInput }, {}, {})).rejects.toThrow('Check-in date cannot be in the past');
    expect(mockBookingModel.create).not.toHaveBeenCalled();
  });

  it('should propagate DB errors', async () => {
    mockBookingModel.create.mockRejectedValueOnce(new Error('DB error'));

    await expect(createBooking({}, { input: validInput }, {}, {})).rejects.toThrow('DB error');
  });
});
