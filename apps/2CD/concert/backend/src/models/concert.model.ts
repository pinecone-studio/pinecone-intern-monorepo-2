import { model, models, Schema } from 'mongoose';

const concertSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    doorOpen: { type: String, required: true },
    musicStart: { type: String, required: true },
    venue: { type: Schema.Types.ObjectId, ref: 'Venue', required: true },
    artistName: { type: String, required: true },
    specialGuestName: { type: String },
    seatData: [{ type: Schema.Types.ObjectId, ref: 'Seat', required: true }],
    endDate: { type: String, required: true },
    primaryPrice: { type: Number, required: true, default: () => 10000 },
    featured: { type: Boolean, required: true, default: () => false },
  },
  { timestamps: true }
);

export const concertModel = models.Concert || model('Concert', concertSchema);