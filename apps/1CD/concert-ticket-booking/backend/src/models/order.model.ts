import { model, models, Schema } from 'mongoose';

type TicketType = {
  _id: Schema.Types.ObjectId;
  zoneName: string;
  soldQuantity: number;
  totalQuantity: number;
  unitPrice: number;
  discount: number;
  additional: string;
};
type Order = {
  userId: Schema.Types.ObjectId;
  ticketId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
  phoneNumber: string;
  email: string;
  status: string;
  payment: string;
  ticketType: TicketType[];
};

const orderSchema = new Schema<Order>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Ticket',
    },
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'unavailable', 'pending', 'approved'],
      default: 'available',
    },
    payment: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    ticketType: [
      {
        zoneName: {
          type: String,
          required: true,
        },
        soldQuantity: {
          type: Number,
          required: true,
        },
        totalQuantity: {
          type: Number,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0,
        },
        additional: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = models['Order'] || model('Order', orderSchema);
export default Order;
