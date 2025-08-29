import { Schema, model, models, Model } from 'mongoose';

const otpTokenSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});


export const OtpToken: Model<any> = models.OtpToken || model('OtpToken', otpTokenSchema);
