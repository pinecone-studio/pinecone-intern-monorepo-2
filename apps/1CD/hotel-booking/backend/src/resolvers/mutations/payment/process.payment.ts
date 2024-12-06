/* eslint-disable camelcase */

import Stripe from 'stripe';

export const processPayment = async (_: unknown, { token, amount }: { token: string; amount: number }) => {
  const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: { token },
  });

  await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method: paymentMethod.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
  });

  return {
    success: true,
    message: 'Payment successful',
  };
};
