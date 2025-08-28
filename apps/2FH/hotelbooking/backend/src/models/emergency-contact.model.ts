import { Schema, model, models, Model, Types } from 'mongoose';

type emergencyContactType = {
  userId: Types.ObjectId;
  name: string;
  phone: string;
  relationship: string;
  createdAt: Date;
  updatedAt: Date;
};

const emergencyContactSchema = new Schema<emergencyContactType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
  },
  { timestamps: true }
);

export const EmergencyContactModel: Model<emergencyContactType> = models['EmergencyContact'] || model('EmergencyContact', emergencyContactSchema);
