import { model, models, Schema, Types } from 'mongoose';

const otpSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
});

export const otpModel = models.Otp || model('Otp', otpSchema);