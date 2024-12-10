import { model, models, Schema } from 'mongoose';

type Request = {
  _id: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  bankAccount: string;
  bankName: string;
  accountOwner: string;
  phoneNumber: string;
  totalPrice: number;
  status: string;
};

const requestSchema = new Schema<Request>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    orderId : {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    bankAccount: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountOwner: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'done'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Request = models['Request'] || model<Request>('Request', requestSchema);
export default Request;
