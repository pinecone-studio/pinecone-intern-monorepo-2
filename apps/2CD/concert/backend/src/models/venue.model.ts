import { model, models, Schema } from 'mongoose';

const venueSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const venueModel = models.Venue || model('Venue', venueSchema);