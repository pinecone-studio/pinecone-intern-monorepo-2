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
type Ticket = {
  _id: Schema.Types.ObjectId;
  scheduledDay: Date;
  ticketType: TicketType[];
};

const ticketSchema = new Schema<Ticket>(
  {
    scheduledDay: {
      type: Date,
      required: true,
    },
    ticketType: [
      {
        zoneName: {
          type: String,
          required: true,
        },
        totalQuantity: {
          type: Number,
          required: true,
        },
        soldQuantity: {
          type: Number,
          default: 0,
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
const Ticket = models['Ticket'] || model<Ticket>('Ticket', ticketSchema);
export default Ticket;
