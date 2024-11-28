import { Schema, model, models } from 'mongoose';

export type OTP = {
  _id: string;
  email: string;
  OTP: string;
  expirationDate: Date
};

const OTPSchema = new Schema<OTP>(
  {
    email: {
      type: String,
      required: true,
    },
    OTP: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

export const OTPModel = models.OTP || model<OTP>('OTP', OTPSchema);
