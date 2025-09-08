/* eslint-disable no-unused-vars */
import { Schema, model, models, Model, Types } from 'mongoose';

enum status {
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Booked = 'Booked',
}

type roomCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type bookingType = {
  userId: Types.ObjectId;
  hotelId: Types.ObjectId;
  roomId: Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  adults: number;
  children: number;
  status: status;
  roomCustomer: roomCustomer;
};

const roomCustomerSchema = new Schema<roomCustomer>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<bookingType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    adults: {
      type: Number,
      required: false,
    },
    children: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(status),
      required: true,
      default: status.Booked,
    },
    roomCustomer: {
      type: roomCustomerSchema,
      required: false,
    },
  },
  { timestamps: true }
);

export const BookingModel: Model<bookingType> = models['Booking'] || model('Booking', bookingSchema);
