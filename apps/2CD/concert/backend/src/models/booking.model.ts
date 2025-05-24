import { model, models, Schema } from 'mongoose';

const bookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    concert: { type: Schema.Types.ObjectId, ref: 'Concert', required: true },
    tickets: [{ type: Schema.Types.ObjectId, ref: 'Ticket', required: true }],
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'REJECTED', 'COMPLETED'],
      default: 'PENDING',
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const bookingsModel = models.Booking || model('Booking', bookingSchema);
