import { model, models, Schema } from 'mongoose';

type UnitTicketType = {
  _id: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  ticketId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  orderId: Schema.Types.ObjectId;
  status: string;
};

const unitTicketSchema = new Schema<UnitTicketType>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Ticket',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'canceled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const UnitTicket = models['UnitTicket'] || model('UnitTicket', unitTicketSchema);
export default UnitTicket;
