import mongoose, { Schema, Document } from 'mongoose';

export interface OtpStoreDocument extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<OtpStoreDocument>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const OtpStore = mongoose.models.OtpStore || mongoose.model<OtpStoreDocument>('OtpStore', otpSchema);
