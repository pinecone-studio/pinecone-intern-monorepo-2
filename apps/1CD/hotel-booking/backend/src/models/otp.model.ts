import { Schema, model, models } from 'mongoose';

export type OtpType = {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
};

const otpSchema = new Schema<OtpType>(
  {
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: (props: { value: string }) => `${props.value} is not a valid email!`,
      },
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  {
    collection: 'otps',
  }
);

export const otpModel = models['Otp'] || model('Otp', otpSchema);
