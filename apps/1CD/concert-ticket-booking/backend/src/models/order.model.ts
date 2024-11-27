import { model, models, Schema } from 'mongoose';

type TicketType = {
  _id: Schema.Types.ObjectId;
  zoneName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};
type Order = {
  userId: Schema.Types.ObjectId;
  tickets: [
    {
      ticketId: Schema.Types.ObjectId;
      eventId: Schema.Types.ObjectId;
      status: string;
      orderNumber: number;
      ticketTypes: TicketType[];
    }
  ];
};

const orderSchema = new Schema<Order>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    tickets: [
      {
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
        status: {
          type: String,
          enum: ['able', 'notable', 'pending'],
          default: 'able',
        },
        orderNumber: {
          type: Number,
          required: true,
        },
        ticketTypes: [
          {
            zoneName: {
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
          },
        ],
      },
      {
        timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = models['Order'] || model('Order', orderSchema);
export default Order;
