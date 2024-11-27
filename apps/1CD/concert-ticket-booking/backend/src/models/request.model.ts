import { model, models, Schema } from 'mongoose';

type Request = {
  _id: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  bankAccount: string;
  bankName: string;
  accountOwner: string;
  totalPrice: number;
  status: string;
};

const requestSchema = new Schema<Request>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Venue',
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
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Request = models['Cancel'] || model<Request>('Request', requestSchema);
export default Request;
