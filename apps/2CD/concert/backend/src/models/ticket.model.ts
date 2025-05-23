import { Schema, model, models, Types } from 'mongoose';

const ticketSchema = new Schema(
  {
    concert: { type: Types.ObjectId, ref: 'Concert', required: true },
    price: { type: Number, required: true },
    type: {
      type: String,
      enum: ['VIP', 'STANDARD', 'BACKSEAT'],
      required: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'SOLD'],
      default: 'AVAILABLE',
    },
  },
  { timestamps: true }
);

export const ticketModel = models.Ticket || model('Ticket', ticketSchema);
