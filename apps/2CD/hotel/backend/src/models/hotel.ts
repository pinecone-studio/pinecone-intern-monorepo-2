import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  hotelName: string;
  price: number;
  description: string;
  phoneNumber: string;
  amenities: string[];
  rooms: mongoose.Types.ObjectId[];
  hotelStar: number;
  guestReviews: mongoose.Types.ObjectId[];
  bookings: mongoose.Types.ObjectId[];
  roomServices: string[];
  images: string[];
}

const HotelSchema: Schema = new Schema(
  {
    hotelName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    amenities: [{ type: String }],
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    hotelStar: { type: Number, min: 1, max: 5 },
    guestReviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    roomServices: [{ type: String }],
    images: [{ type: String }],
    location: { type: String},
  },
  { timestamps: true }
);

export const Hotel = mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema);
