import { model, models, Schema } from 'mongoose';

const SeatInfoSchema = new Schema({
  price: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
});

const SeatCategoriesSchema = new Schema({
  VIP: { type: SeatInfoSchema, required: true },
  Standard: { type: SeatInfoSchema, required: true },
  Backseat: { type: SeatInfoSchema, required: true },
});

const SeatDataSchema = new Schema({
  date: { type: String, required: true },
  seats: { type: SeatCategoriesSchema, required: true },
});

export const seatModel = models.Seat || model('Seat', SeatDataSchema);