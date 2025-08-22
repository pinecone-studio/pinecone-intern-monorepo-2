import { Types } from 'mongoose';

export interface PlainBooking {
  _id?: string | Types.ObjectId;
  id?: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  hotelId: string | Types.ObjectId;
  roomId: string | Types.ObjectId;
  checkInDate: string | Date;
  checkOutDate: string | Date;
  adults: number;
  children: number;
  status: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
