import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: {
    type: String,
    enum: ['login', 'signup', 'reset_password', 'change_phone', 'change_password', 'change_email'],
    required: true,
  },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

export const OTP = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
