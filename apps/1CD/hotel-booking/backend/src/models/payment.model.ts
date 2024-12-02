import { Schema, model, models } from 'mongoose';

export type paymentMethodType = {
  bookingId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'failed';
};

const paymentMethodSchema = new Schema<paymentMethodType>({
  bookingId: String,
  userId: String,
  amount: Number,
  paymentMethod: String,
  status: { type: String, enum: ['paid', 'failed', 'pending'] },
});

export const paymentMethodModel = models['payment-method'] || model('payment-method', paymentMethodSchema);
