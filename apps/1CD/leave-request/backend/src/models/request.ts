import { Schema, model, models } from 'mongoose';

export type Request = {
  _id: string;
  email: string;
  requestType: string;
  message: string;
  requestDate: Date;
  startTime: Date;
  endTime: Date;
  supervisorEmail: string;
  result: string;
  comment: string;
};

const RequstSchema = new Schema<Request>(
  {
    email: {
      type: String,
      required: true,
    },
    requestType: {
        type: String,
        required: true
    },
    message: {
      type: String
    },
    requestDate: {
        type: Date,
        required: true
    },
    startTime: Date,
    endTime: Date,
    supervisorEmail: String,
    result: {
        type: String,
        enum: ['fail', 'success', 'sent', 'pending']
    },
    comment: String
  },
  {
    timestamps: true,
  }
);

export const RequestModel = models.Request || model<Request>('Request', RequstSchema);
