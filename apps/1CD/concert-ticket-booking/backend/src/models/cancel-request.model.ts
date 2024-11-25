import { model, Schema } from 'mongoose';

type Cancel = {
  _id: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  bankAccount: string;
  bankName: string;
  accountOwner: string;
  totalPrice: number;
  status: string;
};

const cancelSchema = new Schema<Cancel>(
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

const Cancel = model<Cancel>('Cancel', cancelSchema);
export default Cancel;
