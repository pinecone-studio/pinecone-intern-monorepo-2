import { Schema, model, models } from 'mongoose';

export type OtpType = {
  email: string;
  otp: string;
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

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'otps',
  }
);

export const otpModel = models['Otp'] || model('Otp', otpSchema);
