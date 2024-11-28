import { model, models, Schema } from 'mongoose';

type TicketType = {
  _id: Schema.Types.ObjectId;
  zoneName: string;
  soldQuantity: number;
  totalQuantity: string;
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
          type: String,
          required: true,
        },
        quantity: {
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
          default: 'nothing',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Ticket = models['Ticket'] || model('Ticket', ticketSchema);
export default Ticket;
