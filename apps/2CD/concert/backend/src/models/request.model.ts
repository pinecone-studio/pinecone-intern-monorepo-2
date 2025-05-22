import { Schema, model, models } from 'mongoose';

const RequestSchema = new Schema(
  {
    concert: {
      type: Schema.Types.ObjectId,
      ref: 'Concert',
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    accountInfo: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['ШИЛЖҮҮЛСЭН', 'ДУУСГАХ'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const RequestModel = models.Request || model('Request', RequestSchema);