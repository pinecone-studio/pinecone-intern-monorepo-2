import { model, models, Schema, Types } from 'mongoose';

const concertSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    schedule: [{ type: Types.ObjectId, ref: 'Schedule', required: true }],
    venue: { type: Types.ObjectId, ref: 'Venue', required: true },
    artists: [{ type: Types.ObjectId, ref: 'Artist', required: true }],
    featured: { type: Boolean, required: true, default: false },
    ticket: [{ type: Types.ObjectId, ref: 'Ticket', required: true }],
    totalProfit : {type : Number, required : true, default : 0}
  },
  { timestamps: true }
);

export const concertModel = models.Concert || model('Concert', concertSchema);
