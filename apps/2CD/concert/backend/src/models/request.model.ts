import { Schema, Types, model, models } from 'mongoose';

const RequestSchema = new Schema(
  {
    booking: { type: Types.ObjectId, ref: 'Booking', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'DONE'],
    },
    bank: { type: String, required: true },
    bankAccount: { type: String, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const RequestModel = models.Request || model('Request', RequestSchema);
