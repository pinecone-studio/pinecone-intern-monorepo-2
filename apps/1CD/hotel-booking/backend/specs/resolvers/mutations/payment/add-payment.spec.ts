import { PaymentInput, PaymentStatus } from 'src/generated';
import { addPayment } from 'src/resolvers/mutations';

jest.mock('src/models', () => ({
  paymentMethodModel: {
    create: jest
      .fn()
      .mockResolvedValueOnce({
        _id: '1',
        bookingId: '2',
        userId: '3',
        amount: 5000,
      })
      .mockRejectedValueOnce(new Error('aldaa')),
  },
}));
describe('add payment', () => {
  const input: PaymentInput = {
    bookingId: '2',
    userId: '3',
    amount: 5000,
    status: PaymentStatus.Paid,
    paymentMethod: 'card',
  };
  it('if addPayment function succussfully worked', async () => {
    const result = await addPayment({}, { input });
    expect(result).toEqual({
      _id: '1',
      bookingId: '2',
      userId: '3',
      amount: 5000,
    });
  });
  it('if addPayment function unsuccussfully worked', async () => {
    try {
      await addPayment({}, { input });
    } catch (err) {
      expect((err as Error).message).toEqual('aldaa');
    }
  });
});
