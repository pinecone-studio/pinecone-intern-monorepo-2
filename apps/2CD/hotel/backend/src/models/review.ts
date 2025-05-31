import mongoose, { Document, Schema } from 'mongoose';
import { BookingStatus } from './booking';
export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  comment: string;
  star: number;
  room: mongoose.Types.ObjectId[];
  totalPrice: number;
  bookStatus: BookingStatus;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    comment: { type: String, required: true },
    star: { type: Number, min: 1, max: 5, required: true },
    room: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    totalPrice: { type: Number, required: true },
    bookStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
      required: true,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
