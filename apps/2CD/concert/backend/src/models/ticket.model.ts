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
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ticketModel = models.Ticket || model('Ticket', ticketSchema);