import { Schema, model, models } from 'mongoose';
import { roomsModel } from './rooms.model';
import { hotelsModel } from './hotels.model';
import { userModel } from './user.model';

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

const bookingSchema = new Schema({
  createdAt: Date,
  userId: { type: String, ref: userModel },
  roomId: { type: String, ref: roomsModel },
  hotelId: { type: String, ref: hotelsModel },
  checkInDate: Date,
  checkOutDate: Date,
  totalPrice: {
    type: Number,
    required: true,
  },
  firtName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
  },
});

export const bookingModel = models['booking'] || model('booking', bookingSchema);
