import { processPayment } from 'src/resolvers/mutations/payment/process.payment';
import Stripe from 'stripe';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentMethods: {
      create: jest.fn().mockResolvedValue({ id: 'pm_fake' }),
    },
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ id: 'pi_fake' }),
    },
  }));
});

describe('process-payment', () => {
  let stripe: jest.Mocked<Stripe>;

  beforeEach(() => {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '') as jest.Mocked<Stripe>;
  });
  it('should successfully process payment', async () => {
    expect(stripe).toBeTruthy();
    const token = 'jfsaf';
    const amount = 5000;
    const result = await processPayment({}, { token, amount });
    expect(result).toEqual({
      success: true,
      message: 'Payment successful',
    });
  });
});
