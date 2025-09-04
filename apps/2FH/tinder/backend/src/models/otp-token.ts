import { Schema, model, models, Model, Document } from 'mongoose';

interface IOtpToken extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpTokenSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const OtpToken: Model<IOtpToken> = models.OtpToken || model<IOtpToken>('OtpToken', otpTokenSchema);
