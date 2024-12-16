import { Schema, model, models } from 'mongoose';
import { roomsModel } from './rooms.model';
import { hotelsModel } from './hotels.model';

export type BookingType = {
  createdAt: Date;
  _id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: 'booked' | 'checked-in' | 'checked-out' | 'cancelled';
};

const bookingSchema = new Schema<BookingType>({
  createdAt: Date,
  userId: String,
  roomId: { type: String, ref: roomsModel },
  hotelId: { type: String, ref: hotelsModel },
  checkInDate: Date,
  checkOutDate: Date,
  totalPrice: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ['booked', 'checked-in', 'checked-out', 'cancelled'],
  },
});

export const bookingModel = models['booking'] || model('booking', bookingSchema);
