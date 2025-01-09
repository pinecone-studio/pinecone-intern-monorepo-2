import { Schema, model, models } from 'mongoose';

export type Request = {
  _id: string;
  email: string;
  requestType: string;
  message: string;
  requestDate: Date;
  startTime?: string;
  endTime?: string;
  supervisorEmail: string;
  result: string;
  comment: string;
  optionalFile: string;
};

const RequstSchema = new Schema<Request>(
  {
    email: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      required: true,
      enum: ['paid', 'unpaid', 'remote'],
    },
    message: {
      type: String,
    },
    requestDate: {
      type: Date,
      required: true,
    },
    startTime: String,
    endTime: String,
    supervisorEmail: String,
    result: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'success'],
      default: 'sent',
    },
    comment: String,
    optionalFile: String,
  },
  {
    timestamps: true,
  },
);

export const RequestModel = models.Request || model<Request>('Request', RequstSchema);
